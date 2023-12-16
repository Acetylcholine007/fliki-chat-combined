import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import helmet from "helmet";
import dotenv from "dotenv";
import * as socketio from "socket.io";
import http from "http";

import corsMiddleware from "./common/middlewares/cors.middleware";
import errorMiddleware from "./common/middlewares/error.middleware";

import authController from "./features/auth/controllers/auth.controller";
import chatController from "./features/chat/controllers/chat.controller";
import chatGroupController from "./features/chat/controllers/chat-group.controller";
import {
  joinUserRoom,
  signalOffline,
  signalOnline,
} from "./features/chat/gateways/chat.gateway";
import { WEBSOCKET_CORS } from "./common/utils/socket.utils";

dotenv.config();
const app: express.Application = express();
const server = http.createServer(app);
const io: socketio.Server = new socketio.Server(server, {
  cors: WEBSOCKET_CORS,
});

// APP LEVEL MIDDLEWARE
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(corsMiddleware);

// APP CONTROLLERS(ROUTES)
app.use("/auth", authController);
app.use("/chat", chatController);
app.use("/chat-group", chatGroupController);

app.use(errorMiddleware);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster${process.env.MONGO_CLUSTER}.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true`
  )
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log(
        `[server]: Server is running at http://localhost:${process.env.PORT}`
      );
    });
    io.on("connection", (socket) => {
      console.log("USER CONNECTED");
      signalOnline(socket);
      joinUserRoom(socket);
      socket.on("disconnect", () => {
        console.log("USER DISCONNECTED");
        signalOffline(socket);
      });
    });
  })
  .catch((error: Error) => console.error(error));

export { io };
