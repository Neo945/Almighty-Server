const mongoose = require('mongoose');

const { Schema } = mongoose;

const autoMessageSchema = new Schema(
    {
        message: {
            type: String,
            default: '',
            trim: true,
            maxlength: 1000,
        },
        response: {
            type: String,
            trim: true,
            required: true,
            minlength: 1,
            maxlength: 1000,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            validate: {
                validator: (userId) => mongoose.Types.ObjectId.isValid(userId),
                message: 'User is not valid',
            },
        },
    },
    {
        timestamps: true,
    }
);

const AutoMessage = mongoose.model('AutoMessage', autoMessageSchema);
module.exports = AutoMessage;
