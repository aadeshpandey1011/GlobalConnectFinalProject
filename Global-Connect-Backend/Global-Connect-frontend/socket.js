




import { io } from "socket.io-client";

const BACKEND_URL =
  import.meta.env.VITE_API_URL || "https://localhost:4000";

console.log("Connecting to backend:", BACKEND_URL);

const socket = io(BACKEND_URL, {
  transports: ["websocket", "polling"],
});

export default socket;

