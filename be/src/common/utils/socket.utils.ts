import { Server } from "http";
import * as socketio from "socket.io";
import { verifyToken } from "./crypto.utils";
import { AccessTokenSchema } from "../../common/models/token.model";

export const WEBSOCKET_CORS = {
  origin: "*",
  methods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: [
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  ],
  credentials: true,
};

let io: socketio.Server;

export const init = (httpServer: Server) => {
  io = new socketio.Server(httpServer, { cors: WEBSOCKET_CORS });
  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

export const socketGuard = async (socket: socketio.Socket) => {
  try {
    const authHeader = (socket.handshake.headers["Authorization"] ??
      socket.handshake.headers["authorization"]) as string;
    if (!authHeader) throw new Error();

    const token = authHeader.split(" ")[1];
    const result = verifyToken(token);
    return AccessTokenSchema.parse(result);
  } catch (err) {
    socket.disconnect(true);
  }
};
