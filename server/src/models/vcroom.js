const mongoose = require('mongoose');

const { Schema } = mongoose;

const VCRoomSchema = new Schema(
    {
        users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },
    {
        timestamps: true,
    }
);

const VCRoom = mongoose.model('VCRoom', VCRoomSchema);

module.exports = VCRoom;
