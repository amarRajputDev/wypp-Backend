import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // Your frontend
      methods: ["GET", "POST"],
      credentials: true,
    }
  });

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});

// const PORT = 8080;
// server.listen(PORT, () => {
//   console.log(`Socket.io Server Running on Port ${PORT}`);
// });

export { app, server, io };
