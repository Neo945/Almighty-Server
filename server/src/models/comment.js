const mongoose = require('mongoose');

const { Schema } = mongoose;

const CommentSchema = new Schema(
    {
        comment: {
            type: String,
            required: true,
            trim: true,
        },
        likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
        User: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);
const Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;
