const jwt = getCookie('jwt');
let _id = null;

document.getElementById('cl').addEventListener('click', () => {
    fetch('http://localhost:5000/api/v1/auth/user').then((res) => {
        res.json().then((data) => {
            _id = data.user._id;
            console.log(_id);
        });
    });
});

const options = {
    query: {},
};
if (jwt) {
    options.query.jwt = jwt;
}
const socket = io('/', options);
const videoGrid = document.getElementById('video-grid');
const inp = document.getElementById('inp');
let ROOMID = null;

inp.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(inp.elements.id.value);
    ROOMID = inp.elements.id.value;
});

document.getElementById('generate').addEventListener('click', async () => {
    const data = await fetch('/api/v1/vc/room');

    const room = await data.json();

    console.log(room);
    document.getElementById('op').innerHTML = room._id;

    ROOMID = room._id;
});

document.getElementById('join').addEventListener('click', () => {
    const myPeer = new Peer(_id, {
        host: '/',
        port: '3001',
    });
    const myVideo = document.createElement('video');
    myVideo.muted = true;
    const peers = {};
    navigator.mediaDevices
        .getUserMedia({
            video: true,
            audio: true,
        })
        .then((stream) => {
            addVideoStream(myVideo, stream);

            myPeer.on('call', (call) => {
                call.answer(stream);
                const video = document.createElement('video');
                call.on('stream', (userVideoStream) => {
                    addVideoStream(video, userVideoStream);
                });
            });

            socket.on('user-connected', (userId) => {
                connectToNewUser(userId.user, stream);
            });
        });

    socket.on('user-disconnected', (userId) => {
        if (peers[userId.user]) peers[userId.user].close();
    });

    myPeer.on('open', (id) => {
        // const ROOMID = 'adfkhbhje';

        console.log(ROOMID);

        socket.emit('join-room', ROOMID, id);
    });

    function connectToNewUser(userId, stream) {
        const call = myPeer.call(userId, stream);
        const video = document.createElement('video');
        call.on('stream', (userVideoStream) => {
            addVideoStream(video, userVideoStream);
        });
        call.on('close', () => {
            video.remove();
        });

        peers[userId] = call;
    }

    function addVideoStream(video, stream) {
        video.srcObject = stream;
        video.addEventListener('loadedmetadata', () => {
            video.play();
        });
        videoGrid.append(video);
    }
});
