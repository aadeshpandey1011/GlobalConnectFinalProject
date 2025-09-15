const MessageModal = require('../models/message');


exports.sendMessage = async(req,res)=>{
    try{
        let { conversation, message,picture } = req.body;
        let addMessage=new MessageModal({sender:req.user._id,conversation,message,picture})
        await addMessage.save()
        let populatedMessage=await addMessage.populate("sender","-password")
        return res.status(201).json(populatedMessage);
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Server error',message:err.message });
    }
} 


exports.getMessage = async(req,res)=>{
    try{
        let {convId} = req.params;
        let message=await MessageModal.find({
            conversation:convId}).populate("sender","-password")
        return res.status(200).json({ messages: "Fetched Message Successfully", message })

    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Server error',message:err.message });
    }
}