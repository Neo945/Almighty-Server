const mongoose = require('mongoose');

const { Schema } = mongoose;

const PostSchema = new Schema(
    {
        description: {
            type: String,
            required: true,
            trim: true,
            default: '',
        },
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    },
    {
        timestamps: true,
    }
);
const Post = mongoose.model('Post', PostSchema);
module.exports = Post;
