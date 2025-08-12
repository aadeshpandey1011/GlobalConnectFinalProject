const PostModel = require('../models/post');
const mongoose = require('mongoose');



exports.addPost = async (req, res) => {
    try {
        const { desc, imageLink } = req.body;
        let userId = req.user._id;

        const addPost = new PostModel({ user: userId, desc, imageLink })
        if (!addPost) {
            return res.status(400).json({ error: "Something Went Wrong" })
        }
        await addPost.save()
        return res.status(200).json({
            message: "Posted Successfully",
            post: addPost
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', message: err.message });
    }
}

exports.likeDislikePost = async (req, res) => {
    try {
        let selfId = req.user._id;
        let { postId } = req.body;
        let post = await PostModel.findById(postId);
        if (!post) {
            return res.status(400).json({ error: 'No Such Post Found' })
        }
        const index = post.likes.findIndex(id => id.equals(selfId));

        if (index !== -1) {
            //User Already Liked The Post Remove Like
            post.likes.splice(index, 1);

        } else {
            //User not liked Yet Add Likes
            post.likes.push(selfId)
        }
        await post.save()
        res.status(200).json({
            message: index !== -1 ? "Post Disliked" : "Post Liked",
            likes: post.likes
        })


        await post.save();
        res.status(200).json({
            message: index !== -1 ? 'Post unliked' : 'Post liked',
            likes: post.likes
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', message: err.message });
    }
}





exports.getPostByPostId = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await PostModel.findById(postId).populate("user", "-password")
                                    .populate({
                                        path: 'originalPost',
                                        populate: { path: 'user', select: '-password' }
                                    });
        if (!post) {
            return res.status(400).json({ error: "No such post found" })
        }
        return res.status(200).json({
            message: "Fetched Data",
            post: post
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', message: err.message });
    }
}






exports.getAllPostForUser = async (req, res) => {
    try {
        const { userId } = req.params;
        let posts = await PostModel.find({ user: userId })
            .sort({ createdAt: -1 })
            .populate("user", "-password")
            .populate({
                path: 'originalPost',
                populate: { path: 'user', select: '-password' }
            });
        return res.status(200).json({
            message: 'Fetched Data',
            posts: posts
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', message: err.message });
    }
}





// Get user's reposts
exports.getUserReposts = async (req, res) => {
    try {
        const { userId } = req.params;
        const reposts = await PostModel.find({ user: userId, isRepost: true })
            .populate('user', 'f_name profilePic headline')
            .populate({
                path: 'originalPost',
                populate: {
                    path: 'user',
                    select: 'f_name profilePic headline'
                }
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            reposts: reposts
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', message: err.message });
    }
}

// Repost analytics
exports.getRepostAnalytics = async (req, res) => {
    try {
        const userId = req.user._id;

        // Get total reposts received on user's posts
        const userPosts = await PostModel.find({ user: userId, isRepost: false });
        const totalRepostsReceived = userPosts.reduce((total, post) => total + (post.reposts?.length || 0), 0);

        // Get total reposts made by user
        const totalRepostsMade = await PostModel.countDocuments({
            user: userId,
            isRepost: true
        });

        // Get most reposted post by user
        const mostRepostedPost = await PostModel.findOne({ user: userId, isRepost: false })
            .sort({ 'reposts.length': -1 })
            .populate('reposts', 'f_name profilePic');

        res.status(200).json({
            success: true,
            analytics: {
                totalRepostsReceived,
                totalRepostsMade,
                mostRepostedPost: mostRepostedPost || null
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', message: err.message });
    }
}


exports.getAllPost = async (req, res) => {
    try {
        console.log('getAllPost called');

        // Get all posts and populate user data
        let posts = await PostModel.find()
            .sort({ createdAt: -1 })
            .populate("user", "-password")
            .populate({
                path: 'originalPost',
                populate: { path: 'user', select: '-password' }
            })
            .lean(); // Use lean() for better performance

        console.log(`Found ${posts.length} total posts`);

        // ✅ Filter out posts with invalid or missing user data
        const validPosts = posts.filter(post => {
            const isValid = post &&
                post._id &&
                post.user &&
                post.user._id &&
                post.user.f_name;

            if (!isValid) {
                console.warn('Invalid post found:', {
                    postId: post?._id,
                    hasUser: !!post?.user,
                    userId: post?.user?._id,
                    userName: post?.user?.f_name
                });
            }

            return isValid;
        });

        console.log(`Returning ${validPosts.length} valid posts`);

        res.status(200).json({
            message: "Fetched Data",
            posts: validPosts
        });

    } catch (err) {
        console.error('Error in getAllPost:', err);
        res.status(500).json({
            error: 'Server error',
            message: err.message
        });
    }
}

// ✅ FIXED: createOrRemoveRepost with better validation
exports.createOrRemoveRepost = async (req, res) => {
    try {
        const { postId, repostType, thoughts } = req.body;
        const userId = req.user._id;

        console.log('Repost request:', { postId, repostType, thoughts, userId });

        // ✅ Validate input
        if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Valid Post ID is required' });
        }

        if (!['direct', 'withThoughts'].includes(repostType)) {
            return res.status(400).json({ message: 'Invalid repost type' });
        }

        if (repostType === 'withThoughts' && (!thoughts || thoughts.trim().length === 0)) {
            return res.status(400).json({ message: 'Thoughts are required for this repost type' });
        }

        // ✅ Find the original post with proper population
        const originalPost = await PostModel.findById(postId).populate('user', 'f_name profilePic headline');

        if (!originalPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // ✅ Validate original post has user data
        if (!originalPost.user || !originalPost.user._id) {
            return res.status(400).json({ message: 'Original post has invalid user data' });
        }

        // Check if user is trying to repost their own post
        if (originalPost.user._id.toString() === userId.toString()) {
            return res.status(400).json({ message: 'You cannot repost your own post' });
        }

        // Handle direct reposts
        if (repostType === 'direct') {
            const existingRepost = await PostModel.findOne({
                user: userId,
                originalPost: postId,
                isRepost: true,
                repostType: 'direct'
            });

            if (existingRepost) {
                // Remove repost
                await PostModel.findByIdAndDelete(existingRepost._id);

                // Remove from original post's reposts array
                originalPost.reposts.pull(userId);
                await originalPost.save();

                return res.status(200).json({
                    message: 'Repost removed successfully',
                    action: 'removed',
                    post: originalPost
                });
            } else {
                // Add repost
                originalPost.reposts.push(userId);
                await originalPost.save();

                // ✅ Create a repost entry with proper user reference
                const repostPost = new PostModel({
                    user: userId,
                    originalPost: postId,
                    isRepost: true,
                    repostType: 'direct',
                    desc: originalPost.desc,
                    imageLink: originalPost.imageLink, // ✅ Copy image link too
                    reposts: [],
                    likes: [],
                    comments: 0
                });

                await repostPost.save();

                // ✅ Populate the repost for response with error handling
                const populatedRepost = await PostModel.findById(repostPost._id)
                    .populate('user', 'f_name profilePic headline')
                    .populate({
                        path: 'originalPost',
                        populate: {
                            path: 'user',
                            select: 'f_name profilePic headline'
                        }
                    });

                // ✅ Validate populated data before sending
                if (!populatedRepost || !populatedRepost.user || !populatedRepost.originalPost) {
                    throw new Error('Failed to populate repost data');
                }

                return res.status(201).json({
                    message: 'Post reposted successfully',
                    action: 'added',
                    post: populatedRepost,
                    originalPost: originalPost
                });
            }
        }

        // Handle reposts with thoughts
        if (repostType === 'withThoughts') {
            // Add to original post's repost count if not already there
            if (!originalPost.reposts.includes(userId)) {
                originalPost.reposts.push(userId);
                await originalPost.save();
            }

            // ✅ Create new post with thoughts
            const repostPost = new PostModel({
                user: userId,
                originalPost: postId,
                isRepost: true,
                repostType: 'withThoughts',
                repostThoughts: thoughts.trim(),
                desc: originalPost.desc,
                imageLink: originalPost.imageLink, // ✅ Copy image link too
                reposts: [],
                likes: [],
                comments: 0
            });

            await repostPost.save();

            // ✅ Populate the repost for response with error handling
            const populatedRepost = await PostModel.findById(repostPost._id)
                .populate('user', 'f_name profilePic headline')
                .populate({
                    path: 'originalPost',
                    populate: {
                        path: 'user',
                        select: 'f_name profilePic headline'
                    }
                });

            // ✅ Validate populated data before sending
            if (!populatedRepost || !populatedRepost.user || !populatedRepost.originalPost) {
                throw new Error('Failed to populate repost data');
            }

            return res.status(201).json({
                message: 'Post reposted with thoughts successfully',
                action: 'created',
                post: populatedRepost,
                originalPost: originalPost
            });
        }

    } catch (error) {
        console.error('Repost error:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

// ✅ FIXED: getTop5PostForUser with validation
exports.getTop5PostForUser = async (req, res) => {
    try {
        const { userId } = req.params;

        console.log('getTop5PostForUser called with userId:', userId);

        // ✅ Validate userId
        if (!userId || userId === 'undefined' || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: 'Valid user ID is required'
            });
        }

        let posts = await PostModel.find({ user: userId })
            .sort({ createdAt: -1 })
            .populate("user", "-password")
            .populate({
                path: 'originalPost',
                populate: { path: 'user', select: '-password' }
            })
            .limit(5)
            .lean();

        // ✅ Filter out invalid posts
        const validPosts = posts.filter(post => {
            return post && post._id && post.user && post.user._id;
        });

        return res.status(200).json({
            success: true,
            message: 'Fetched Data',
            posts: validPosts
        });

    } catch (err) {
        console.error('Error in getTop5PostForUser:', err);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
}