const { create } = require('../models/comment');
const ConversationModal = require('../models/conversation');
const MessageModal = require('../models/message');



exports.addConversation = async (req, res) => {
    try {
        let senderId = req.user._id;
        let { recieverId, message } = req.body;
        let isConvExist = await ConversationModal.findOne({
            members: { $all: [senderId, recieverId] }
        });
        if (!isConvExist) {
             let newConversation=new ConversationModal({
                members:[senderId,recieverId]
             })
             await newConversation.save()
             let addMessage=new MessageModal({sender:req.user._id,conversation:newConversation._id,message})
             await addMessage.save()
            
        } else {
            let addMessage = new MessageModal({ sender: req.user._id, conversation: isConvExist._id, message });
            await addMessage.save();
        }

        return res.status(201).json({ message: "Message Sent" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', message: err.message });
    }
}


exports.getConversation = async (req, res) => {
    try {
        let loggedinId = req.user._id;
        let conversation= await ConversationModal.find({
            members:{$in:[loggedinId]}
        }).populate("members","-password").sort({createdAt:-1})
        return res.status(200).json({
            message: "Fectched Successfully",
            conversations: conversation
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', message: err.message });
    }
}