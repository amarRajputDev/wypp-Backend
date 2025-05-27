import express from "express";
import http from "http"; // Import HTTP module
import { Server } from "socket.io"; // Import socket.io
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import dbConnect from "./config/DbConnect.js";
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import CollegeRoutes from "./routes/collegeRoutes.js";
import uploadRouter from "./routes/uploadsRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import friendsRouter from "./routes/friendsRoutes.js";

dotenv.config();
const app = express();
const server = http.createServer(app); // Create HTTP server
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Allow frontend origin
    credentials: true, // Allow cookies/tokens
  },
});

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Routes
app.use("/api/user", userRoutes);
app.use("/api/colleges", CollegeRoutes);
app.use("/api/uploads", uploadRouter);
app.use("/api/message", messageRouter);
app.use("/api/friends", friendsRouter);

export const getReceiverSocketId = (receiverId) =>{
  return userSocketMap[receiverId]
}


const userSocketMap = {}
// WebSocket connection
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  const userId= socket.handshake.query.userId

  if (userId !== undefined) {
    userSocketMap[userId] = socket.id
  }

  io.emit('getOnlineUsers',Object.keys(userSocketMap))

  socket.on("sendMessage", (data) => {
    console.log("Message received:", data);
    io.emit("receiveMessage", data); // Broadcast message to all clients
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
    delete userSocketMap[userId]
    io.emit('getOnlineUsers',Object.keys(userSocketMap))
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  dbConnect();
  console.log(`Server is running on port ${PORT}`);
});
