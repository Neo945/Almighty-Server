const path = require('path');
const VCRoom = require('../models/vcroom');

module.exports = {
    getVCRoom: async (req, res) => {
        res.sendFile(path.join(__dirname, '../templates', 'videoc.html'));
    },
    getRoom: async (req, res) => {
        const room = await VCRoom.create({ users: [req.user._id] });
        res.send(room);
    },
};
