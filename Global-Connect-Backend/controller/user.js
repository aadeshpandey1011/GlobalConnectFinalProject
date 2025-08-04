const User = require('../models/user');
const bcryptjs = require('bcryptjs');


exports.register = async (req, res) => {
    try {
        let { email, password, f_name } = req.body;
        let isUserExist = await User.findOne({ email });
        if(isUserExist){
           return res.status(500).json({ error: 'Already have account with this email. try with another account '});
        }

        const hashedPassword =await bcryptjs.hash(password,12);
        console.log(hashedPassword);
        
        const newUser = new User({email,password:hashedPassword,f_name});
        await newUser.save();

        return res.status(201).json({ message: 'User registered successfully', success: "yes", data: newUser });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', message: err.message });
    }
}