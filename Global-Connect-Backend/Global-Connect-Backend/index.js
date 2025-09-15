// const express = require('express')
// const app = express()
// const cookieParser = require('cookie-parser')
// const cors= require('cors')



// require('./connection');

// require('dotenv').config({path:"./config.env"});

// const PORT = process.env.PORT || 4000;

// app.use(express.json());
// app.use(cookieParser());
// app.use(cors({
//   credentials: true,
//   origin: [
//     'http://localhost:5173', // local dev
//     'https://globalconnectfinalproject-1.onrender.com', // frontend
//     'https://globalconnectfinalproject.onrender.com'    // backend (if needed for redirects)
//   ]
// }));

// app.get('/', (req, res) => {
//   res.send('Global Connect Backend is running');
// });

// const UserRoutes = require('./routes/user');
// const PostRoutes = require('./routes/post');

// const NotificationRoutes = require('./routes/notification')
// const CommentRoutes = require('./routes/comment')
// const ConversationRoutes = require('./routes/conversations');
// const MessageRoutes = require('./routes/message')



// app.use('/api/auth',UserRoutes);
// app.use('/api/post',PostRoutes);
// app.use('/api/notification',NotificationRoutes);
// app.use('/api/comment',CommentRoutes)

// app.use('/api/conversation',ConversationRoutes)
// app.use('/api/message',MessageRoutes)


// app.listen(PORT, () => {
//   console.log(`Example app listening on port ${PORT}`)
// })








const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('./connection');
require('dotenv').config({ path: "./config.env" });

const PORT = process.env.PORT || 4000;

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: [
    'https://localhost:5173',
    'https://globalconnectfinalproject-1.onrender.com',
    'https://globalconnectfinalproject.onrender.com'
  ]
}));

// Routes
app.get('/', (req, res) => {
  res.send('Global Connect Backend is running');
});

const UserRoutes = require('./routes/user');
const PostRoutes = require('./routes/post');
const NotificationRoutes = require('./routes/notification');
const CommentRoutes = require('./routes/comment');
const ConversationRoutes = require('./routes/conversations');
const MessageRoutes = require('./routes/message');

app.use('/api/auth', UserRoutes);
app.use('/api/post', PostRoutes);
app.use('/api/notification', NotificationRoutes);
app.use('/api/comment', CommentRoutes);
app.use('/api/conversation', ConversationRoutes);
app.use('/api/message', MessageRoutes);

// Create HTTP server (needed for Socket.IO)
const http = require('http');
const server = http.createServer(app);

// Attach Socket.IO
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: [
      'https://localhost:5173',
      'https://globalconnectfinalproject-1.onrender.com',
      'https://globalconnectfinalproject.onrender.com'
    ],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Socket.IO connection event
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
