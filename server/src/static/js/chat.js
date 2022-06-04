const chat = document.getElementById('chat');

const socket = io('http://localhost:5000', {
    query: {
        jwt: getCookie('jwt'),
    },
});

socket.emit('join', { room: 'general' });

socket.on('message', (message) => {
    document.querySelector('.chat').innerHTML += `<li class='r'>${message.context}</li>`;
});

socket.on('messages', (messages) => {
    messages.forEach((message) => {
        document.querySelector('.chat').innerHTML += `<li class='l'>${message.context}</li>`;
    });
});

chat.addEventListener('submit', function (event) {
    event.preventDefault();
    const message = event.target.elements.msg.value;
    socket.emit('chatMessage', message);
    // console.log(message);
});
