/* eslint-disable no-param-reassign */
const SocketUserAuthMiddleware = require('../middleware/SocketUserAuth.middleware');
const Room = require('../models/room');
const Message = require('../models/message');
const { io } = require('../server');

function saveMessage(content, type, user, room) {
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
            Room.findById(room).then((roomdata) => {
                roomdata.messages.push(newMessage._id);
                roomdata.save().then((savedRoom) => {
                    resolve(savedMessage);
                });
            });
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

function joinUser(id, user, roomId) {
    return new Promise((resolve, reject) => {
        Room.findById(roomId)
            .then((room) => {
                if (room) {
                    if (room.users.indexOf(user._id) === -1) {
                        room.users.push(user._id);
                        room.save((err, savedRoom) => {
                            if (err) {
                                reject(err);
                            }
                            resolve(savedRoom, true);
                        });
                    }
                    resolve(room, true);
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

io.use(SocketUserAuthMiddleware);

io.on('connection', (socket) => {
    socket.on('join', (data) => {
        console.log(data);
        joinUser(socket.id, socket.user, data.roomId)
            .then((room, is) => {
                socket.join(data.roomId);
                io.to(data.roomId).emit('joined', {
                    room,
                    user: socket.user,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    });

    socket.on('leave', (data) => {
        leaveUser(socket.user, data.roomId)
            .then((room) => {
                socket.leave(data.roomId);
                io.to(data.roomId).emit('left', {
                    room,
                    user: socket.user,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    });

    socket.on('message', (data) => {
        saveMessage(data.content, data.type, socket.user, data.roomId)
            .then((message) => {
                console.log(message);
                io.to(data.roomId).emit('message', {
                    message,
                    user: socket.user,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
