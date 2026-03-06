import { Server } from "socket.io";

let messages = {};       // Store chat messages room-wise
let timeOnline = {};     // Track user online time

export const connectTosocket = (server) => {

  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,   
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // ===================== JOIN CALL =====================
    socket.on("join-call", (roomId) => {

      socket.join(roomId);          // ✅ Use socket rooms
      socket.roomId = roomId;       // Save room reference
      timeOnline[socket.id] = Date.now();

      console.log(`${socket.id} joined room ${roomId}`);

      // Send old messages if exist
      if (messages[roomId]) {
        messages[roomId].forEach(msg => {
          socket.emit(
            "chat-message",
            msg.data,
            msg.sender,
            msg.senderId
          );
        });
      }

      // Notify others in room
      socket.to(roomId).emit("user-joined", socket.id);
    });

    // ===================== SIGNAL =====================
    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal", socket.id, message);
    });

    // ===================== CHAT =====================
    socket.on("chat-message", (data, sender) => {

      const roomId = socket.roomId;
      if (!roomId) return;

      if (!messages[roomId]) {
        messages[roomId] = [];
      }

      const messageObj = {
        sender,
        data,
        senderId: socket.id
      };

      messages[roomId].push(messageObj);

      io.to(roomId).emit(
        "chat-message",
        data,
        sender,
        socket.id
      );
    });

    // ===================== DISCONNECT =====================
    socket.on("disconnect", () => {

      const roomId = socket.roomId;
      const onlineTime = Date.now() - (timeOnline[socket.id] || Date.now());

      console.log(`Socket disconnected: ${socket.id}`);

      if (roomId) {
        socket.to(roomId).emit(
          "user-disconnected",
          socket.id,
          onlineTime
        );
      }

      delete timeOnline[socket.id];
    });

  });

  return io;
};