const CommentModel = require('../models/comment');
const PostModel = require('../models/post');
const NotificationModal = require('../models/notification');

exports.commentPost = async(req,res)=>{
    try{
        const {postId,comment} = req.body;
        const userId = req.user._id;

        const postExist = await PostModel.findById(postId);
        if(!postExist){
            return res.status(400).json({error:'Post Doesnt exist'});
        }

        const newComment = new CommentModel({
            comment,
            user:userId,
            postId:postId
        })
        await newComment.save();
        postExist.comments.push(newComment._id);
        await postExist.save();

        const populatedComment = await CommentModel.findById(newComment._id).populate('user','f_name headline profilePic');

        if (!postExist.user.equals(userId)) {
            const content = `${req.user.f_name} has commented on your Post`;
            const notification = new NotificationModal({sender:userId,reciever:postExist.user._id,content,type:'comment',postId:postId.toString()})
            await notification.save();
        }
        return res.status(200).json({message:"Comment Added",comment:populatedComment})
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Server error',message:err.message });
    }
}


exports.getCommentByPostId = async(req,res)=>{
    try{
        const {postId} = req.params;
        const isPostExist = await PostModel.findById(postId);
        if(!isPostExist){
             return res.status(400).json({error:'Post Doesnt exist'});
        }
        const comments = await CommentModel.find({postId:postId}).populate('user','f_name headline profilePic');
        return res.status(201).json({
            message:"Comments fetched",
            comments:comments
        })
    } catch(err){
        console.error(err);
        res.status(500).json({ error: 'Server error',message:err.message });
    }
}