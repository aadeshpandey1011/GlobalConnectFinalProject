const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Keep this as 'user' to match your existing setup
        required: true
    },
    desc: {
        type: String,
    },
    imageLink: {
        type: String
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        }
    ],
    comments: {
        type: Number,
        default: 0
    },
    
    // REPOST FIELDS - Fixed references
    reposts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user' // Changed from 'User' to 'user' to match your model
    }],
    originalPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post' // Changed from 'Post' to 'post' to match your model
    },
    repostThoughts: {
        type: String,
        maxlength: 500
    },
    isRepost: {
        type: Boolean,
        default: false
    },
    repostType: {
        type: String,
        enum: ['direct', 'withThoughts'],
        default: null
    }

}, { timestamps: true });

// Add indexes for better performance
PostSchema.index({ user: 1 });
PostSchema.index({ isRepost: 1 });
PostSchema.index({ originalPost: 1 });
PostSchema.index({ user: 1, isRepost: 1 });
PostSchema.index({ createdAt: -1 });

const PostModel = mongoose.model('post', PostSchema);
module.exports = PostModel;
