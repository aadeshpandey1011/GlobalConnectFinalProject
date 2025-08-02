const mongoose = require('mongoose');


// DB name global-connect

mongoose.connect('mongodb://localhost:27017/global-connect').then(res=>{
    console.log("Database Successfully connected")
}).catch(err=>{
    console.log(err)
})