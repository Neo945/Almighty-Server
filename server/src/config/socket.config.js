/* eslint-disable no-param-reassign */
const socketio = require('socket.io');
const SocketUserAuthMiddleware = require('../middleware/SocketUserAuth.middleware');
const Room = require('../models/room');
const Message = require('../models/message');

function saveMessage(content, type, user) {
    return new Promise((resolve, reject) => {
        const newMessage = new Message({
            user: user._id,
            content,
            type,
        });
        newMessage.save((err, savedMessage) => {
            if (err) {
                reject(err);
            }
            resolve(savedMessage);
        });
    });
}

function getMessages(roomId) {
    return new Promise((resolve, reject) => {
        Message.find({ room: roomId })
            .then((messages) => {
                resolve(messages);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

function joinUser(user, roomId) {
    return new Promise((resolve, reject) => {
        Room.findById(roomId)
            .then((room) => {
                if (room) {
                    room.users.push(user._id);
                    room.save((err, savedRoom) => {
                        if (err) {
                            reject(err);
                        }
                        resolve(savedRoom, true);
                    });
                } else {
                    Room.create({
                        users: [user._id],
                    }).then((newRoom) => {
                        resolve(newRoom, false);
                    });
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
}

function leaveUser(user, roomId) {
    return new Promise((resolve, reject) => {
        Room.findById(roomId)
            .then((room) => {
                if (room) {
                    room.users.filter((userId) => userId.toString() !== user._id.toString());
                    room.save((err, savedRoom) => {
                        if (err) {
                            reject(err);
                        }
                        resolve(savedRoom);
                    });
                } else {
                    resolve(null);
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
}

module.exports = (server) => {
    const io = socketio(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });

    io.use(SocketUserAuthMiddleware);

    io.on('connection', (socket) => {
        console.log('a user connected');
        socket.on('join', (roomId) => {
            joinUser(socket.user, roomId).then((room, isNewUser) => {
                socket.join(room._id);
                socket.emit('message', saveMessage('Welcome', 'inst', socket.user));
                socket.broadcast.to(room._id).emit('message', saveMessage('Another user connected', 'inst', socket.user));
                if (isNewUser) {
                    getMessages(room._id).then((messages) => {
                        socket.emit('messages', messages);
                    });
                }
            });
            socket.on('chatMessage', (message) => {
                io.to(roomId).emit('message', saveMessage(message, 'text', socket.user));
            });
        });

        socket.on('disconnect', () => {
            leaveUser(socket.user, socket.room).then((room) => {
                socket.broadcast.to(room._id).emit('message', saveMessage('Another user disconnected', 'inst', socket.user));
            });
        });

        socket.on('user-vs-join', (roomId) => {
            joinUser(socket.user, roomId).then((room, isNewUser) => {
                socket.join(room._id);
                socket.to(room._id).emit('notify-joined-user', socket.user);
            });
        });
    });

    // io.on('connection', (socket) => {

    // });

    // io.on('connection', (socket) => {
    // });
    return io;
};
