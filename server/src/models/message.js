const mongoose = require('mongoose');
// const { isURL } = require('validator').default;

const { Schema } = mongoose;

const MessageSchema = new Schema(
    {
        room: {
            type: Schema.Types.ObjectId,
            ref: 'Room',
            // required: true,
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'user',
            required: [true, 'Please provide an user'],
        },
        content: {
            type: String,
            required: true,
            trim: true,
            default: '',
        },
        // objectUrl: {
        //     type: String,
        //     trim: true,
        //     validate: [isURL, 'Invalid URL'],
        // },
        type: {
            type: String,
            required: true,
            default: 'text',
            enum: {
                values: ['text', 'image', 'video', 'inst'],
                message: 'Invalid type of message {VALUE}',
            },
        },
    },
    {
        timestamps: true,
    }
);

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
