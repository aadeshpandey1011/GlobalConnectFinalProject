const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    googleId: {
        type:String,
    },
    email:{
        type:String,
        required:true
    },
    password: {
        type: String,
    },
    f_name: {
        type: String,
        default: ""
    },
    headline: {
        type: String,
        default: ""
    },
    curr_company: {
        type: String,
        default: ""
    },
    curr_location: {
        type: String,
        default: ""
    },
    profilePic: {
        type: String,
        default:"https://img.freepik.com/premium-vector/user-circle-with-blue-gradient-circle_78370-4727.jpg?w=1380"
    },
    cover_pic:{
        type:String,
        default:'https://plus.unsplash.com/premium_photo-1701534008693-0eee0632d47a?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    about: {
        type: String,
        default: ""
    },
    skills: {
        type: [String],
        default: [],
    },
    experience: [
        {
            designation: {
                type: String,
            },
            company_name: {
                type: String,
            },
            duration: {
                type: String,
            },
            location: {
                type: String,
            },
        }
    ],
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        }
    ],
    pending_friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        }
    ],
    resume: {
        type: String,
    },
},{timestamps:true});

const userModel = mongoose.model('user',UserSchema);
module.exports = userModel;