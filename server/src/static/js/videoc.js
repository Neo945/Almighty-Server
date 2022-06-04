const roomid = window.location.pathname.split('/')[2];

const peer = new Peer(roomid, {
    host: '/',
    port: '3001',
});
// peerjs --port 3001

const videogrid = document.getElementById('videogrid');
const video = document.createElement('video');
video.muted = true;
video.autoplay = true;

function addVideoStream(stream, video) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    });
    videogrid.appendChild(video);
}

navigator.mediaDevices
    .getUserMedia({
        video: true,
        audio: true,
    })
    .then((stream) => {
        addVideoStream(stream, video);

        peer.on('call', (call) => {
            call.answer(stream);
            call.on('stream', (remoteStream) => {
                const video = document.createElement('video');
                video.muted = true;
                video.autoplay = true;
                addVideoStream(remoteStream, video);
            });
        });

        socket.on('user-vc-connect', (user) => {
            const call = peer.call(user.id, stream);
            call.on('stream', (remoteStream) => {
                const video = document.createElement('video');
                video.muted = true;
                video.autoplay = true;
                addVideoStream(remoteStream, video);
            });
        });
    });

peer.on('open', (id) => {
    console.log('My peer ID is: ' + id);
});

const socket = io('http://localhost:5000', {
    query: {
        jwt: getCookie('jwt'),
    },
});
socket.emit('join', { room: roomid });

socket.on('notify-joined-user', (user) => {});
