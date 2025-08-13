// import {io} from "socket.io-client";

// const socket = io('https://globalconnectfinalproject.onrender.com');


// export default socket;






import {io} from "socket.io-client";

// Use environment variable from Vercel or fallback to localhost for development
const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:10000';

console.log('Connecting to backend:', BACKEND_URL); // Debug log

const socket = io(BACKEND_URL, {
  transports: ['websocket', 'polling'],
  timeout: 20000,
  forceNew: true
});

export default socket;
