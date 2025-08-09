const mongoose = require('mongoose');


// DB name global-connect

mongoose.connect('mongodb+srv://pandeyAadesh:webdev01@clusternumberek.jv58ydr.mongodb.net/?retryWrites=true&w=majority&appName=ClusterNumberEk').then(res=>{
    console.log("Database Successfully connected")
}).catch(err=>{
    console.log(err)
})