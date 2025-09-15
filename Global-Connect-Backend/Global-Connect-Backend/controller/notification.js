const NotificationModal = require('../models/notification')



exports.getNotification = async(req,res)=>{
    try{
        let ownId = req.user._id;
        let notifications =await NotificationModal.find({reciever:ownId}).sort({createdAt:-1}).populate("sender reciever") 
        return res.status(200).json({
            message:"Notification Feched Successfully",
            notifications:notifications
        })
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Server error',message:err.message });
    }
}


exports.updateRead = async(req,res)=>{
    try{
        const {notificationId} = req.body;
        const notification =await NotificationModal.findByIdAndUpdate(notificationId,{isRead:true})
        if(!notification){
            return res.status(400).json({eror:"notification not fount"})
        }
        return res.status(200).json({
            message:"Read notification"
        })
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Server error',message:err.message });
    }
}


exports.activeNotify = async(req,res)=>{
    try{
        let ownId = req.user._id;
        let notifications =await NotificationModal.find({reciever:ownId,isRead:false}) 
        return res.status(200).json({
            message:"Notification Number fetched Successfully",
            count:notifications.length
        })
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Server error',message:err.message });
    }
}