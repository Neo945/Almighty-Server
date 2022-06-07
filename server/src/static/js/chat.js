const chat = document.getElementById('chat');

const roomId = '629f405bda769a5efa110e01';

const jwt = getCookie('jwt');
const options = {
    query: {},
};
if (jwt) {
    options.query.jwt = jwt;
}
const socket = io('http://localhost:5000', options);

socket.emit('join', { roomId });

socket.on('message', (message) => {
    console.log(message);
    document.querySelector('.chat').innerHTML += `<li class='r'>${message.content}</li>`;
});

socket.on('messages', (messages) => {
    console.log(messages);
    messages.forEach((message) => {
        document.querySelector('.chat').innerHTML += `<li class='l'>${message.content}</li>`;
    });
});
socket.on('joined', (data) => {
    console.log(data);
});

chat.addEventListener('submit', function (event) {
    event.preventDefault();
    const message = event.target.elements.msg.value;
    console.log(message);
    socket.emit('message', { content: message, type: 'text', roomId });
});
