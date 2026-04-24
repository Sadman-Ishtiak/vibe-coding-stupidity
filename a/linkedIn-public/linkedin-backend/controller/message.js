const MessageModal = require('../models/message');


exports.sendMessage = async(req,res)=>{
    try{
        let { conversation, message,picture } = req.body;
        const sender = req.user._id;
        const newMessage = new MessageModal({
             conversation,
             sender,
             message,
             picture
        });
        await newMessage.save();
        const populatedMessage = await MessageModal.findById(newMessage._id).populate('sender', 'f_name profilePic');
        
        return res.status(201).json({ message: populatedMessage });
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Server error',message:err.message });
    }
} 


exports.getMessage = async(req,res)=>{
    try{
        let {convId} = req.params;
        const messages = await MessageModal.find({conversation: convId}).populate('sender', 'f_name profilePic');
        return res.status(200).json({ message: "Fetched Message Successfully", messages: messages })

    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Server error',message:err.message });
    }
}