const PostModel = require('../models/post');


exports.addPost = async (req, res) => {
    try {
        const { desc, imageLink } = req.body;
        let userId = req.user._id;

        const addPost = new PostModel({ user: userId, desc, imageLink })
        await addPost.save();
        return res.status(201).json({ message: "Post Created", post: addPost });

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
        
        if (!post) return res.status(404).json({ error: 'Post not found' });

        const index = post.likes.findIndex(id => id.equals(selfId));

        if (index !== -1) {
            post.likes.splice(index, 1);
        } else {
            post.likes.push(selfId);
        }

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
        return res.status(200).json({ posts });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', message: err.message });
    }
}

exports.getPostByPostId = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await PostModel.findById(postId).populate("user", "-password");
        // 
        // 
        // Please watch video for full code
        // 
        // 
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', message: err.message });
    }
}

exports.getTop5PostForUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const posts = await PostModel.find({ user: userId }).limit(5).sort({ createdAt: -1 });
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
        const posts = await PostModel.find({ user: userId }).sort({ createdAt: -1 });
        return res.status(200).json({ posts });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', message: err.message });
    }
}