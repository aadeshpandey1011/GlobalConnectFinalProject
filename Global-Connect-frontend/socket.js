// import {io} from "socket.io-client";

// const socket = io('https://globalconnectfinalproject.onrender.com');


// export default socket;




import { io } from "socket.io-client";

const BACKEND_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

console.log("Connecting to backend:", BACKEND_URL);

const socket = io(BACKEND_URL, {
  transports: ["websocket", "polling"],
});

export default socket;

