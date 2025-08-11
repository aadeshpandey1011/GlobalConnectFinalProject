const mongoose = require('mongoose');


// DB name global-connect

mongoose.connect('mongodb+srv://GlobalConnectDEV:dev123456@cluster0.s38wbwu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(res=>{
    console.log("Database Successfully connected")
}).catch(err=>{
    console.log(err)
})