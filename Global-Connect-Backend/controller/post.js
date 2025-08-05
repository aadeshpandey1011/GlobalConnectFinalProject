const PostModel = require('../models/post');



exports.addPost = async (req, res) => {
    try {
        const { desc, imageLink } = req.body;
        let userId = req.user._id;

        const addPost = new PostModel({ user: userId, desc, imageLink })
        if(!addPost){
            return res.status(400).json({error:"Something Went Wrong"})
        }
        await addPost.save()
        return res.status(200).json({
            message:"Posted Successfully",
            post:addPost
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
        if(!post){
            return res.status(400).json({error:'No Such Post Found'})
        }
        const index = post.likes.findIndex(id=>id.equals(selfId));

        if(index!==-1){
            //User Already Liked The Post Remove Like
            post.likes.splice(index,1);

        }else{
            //User not liked Yet Add Likes
            post.likes.push(selfId)
        }
        await post.save()
        res.status(200).json({
            message:index!==-1?"Post Disliked":"Post Liked",
            likes:post.likes
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


exports.getAllPost = async (req, res) => {
    try {
        let posts = await PostModel.find().sort({ createdAt: -1 }).populate("user", "-password");
        res.status(200).json({
            message:"Fetched Data",
            posts:posts
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', message: err.message });
    }
}


exports.getPostByPostId = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await PostModel.findById(postId).populate("user", "-password");
        if(!post){
            return res.status(400).json({error:"No such post found"})
        }
        return res.status(200).json({
            message:"Fetched Data",
            post:post
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', message: err.message });
    }
}


exports.getTop5PostForUser = async (req, res) => {
    try {
        const { userId } = req.params;
        let posts = await PostModel.find({user:userId}).sort({ createdAt: -1 }).populate("user", "-password").limit(5);
        
        return res.status(200).json({
            message: 'Fetched Data',
            posts: posts
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', message: err.message });
    }
}


exports.getAllPostForUser = async (req, res) => {
    try {
        const { userId } = req.params;
        let posts = await PostModel.find({user:userId}).sort({ createdAt: -1 }).populate("user", "-password");
        return res.status(200).json({
            message: 'Fetched Data',
            posts: posts
        });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', message: err.message });
    }
}