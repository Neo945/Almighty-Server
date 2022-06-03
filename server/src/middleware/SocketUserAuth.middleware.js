/* eslint-disable no-param-reassign */
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');

async function SocketUserAuthentication(socket, next) {
    if (socket.handshake.query && socket.handshake.query.jwt) {
        jwt.verify(socket.handshake.query.jwt, process.env.SECRET_KEY, (err, id) => {
            if (err) {
                console.log(err);
                socket.user = null;
                next();
            } else {
                User.findOne({ user: id.id })
                    .then(async (user) => {
                        console.log(user);
                        socket.user = user;
                        next();
                    })
                    .catch((erro) => console.log(erro));
            }
        });
    } else {
        socket.user = null;
        next();
    }
}
module.exports = SocketUserAuthentication;
