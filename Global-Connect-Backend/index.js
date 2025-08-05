const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')



require('./connection');

require('dotenv').config({path:"./config.env"});

const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());

const UserRoutes = require('./routes/user');
const PostRoutes = require('./routes/post');
const NotificationRoutes = require('./routes/notification')
const CommentRoutes = require('./routes/comment')



app.use('/api/auth',UserRoutes);
app.use('/api/post',PostRoutes);
app.use('/api/notification',NotificationRoutes);
app.use('/api/comment',CommentRoutes)

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})