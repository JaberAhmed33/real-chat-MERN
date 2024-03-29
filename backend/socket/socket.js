import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
		origin: ["https://real-chat-kh45.onrender.com"],
		methods: ["GET", "POST"],
	},
});

export const getReceiverId = (receiverId) => {
    return usersSocketMap[receiverId];
}

const usersSocketMap = {}

io.on("connection", (socket) => {
    console.log("user connected", socket.id);

    const userId = socket.handshake.query.userId;

    if (userId !== undefined) {
        usersSocketMap[userId] = socket.id
    }

    io.emit("getOnlineUsers", Object.keys(usersSocketMap));

    socket.on("disconnect", () => {
        console.log("user is disconnected", socket.id);
        delete usersSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(usersSocketMap));
    })
})

export { app, io, server };
