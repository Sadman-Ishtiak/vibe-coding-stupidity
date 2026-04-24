
const NotificationModal = require('../models/notification')



exports.getNotification = async(req,res)=>{
    try{
        let ownId = req.user._id;
        const notifications = await NotificationModal.find({reciever:ownId}).sort({createdAt:-1}).populate('sender','f_name profilePic');
        return res.status(200).json({notifications});
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Server error',message:err.message });
    }
}

exports.updateRead = async(req,res)=>{
    try{
        const {notificationId} = req.body;
        const notification = await NotificationModal.findById(notificationId);
        if(!notification) return res.status(404).json({error: "Notification not found"});
        
        notification.isRead = true;
        await notification.save();
        
        return res.status(200).json({message: "Notification read"});
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Server error',message:err.message });
    }
}


exports.activeNotify = async(req,res)=>{
    try{
        let ownId = req.user._id;
        const count = await NotificationModal.countDocuments({reciever:ownId, isRead: false});
        return res.status(200).json({active: count > 0, count});
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Server error',message:err.message });
    }
}