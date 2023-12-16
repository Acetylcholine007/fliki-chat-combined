import { socketGuard } from "../../../common/utils/socket.utils";
import UserEntity from "../../auth/models/user.entity";
import * as socketio from "socket.io";

export const joinUserRoom = async (socket: socketio.Socket) => {
  const tokenData = await socketGuard(socket);

  if (!tokenData) return;

  socket.join(tokenData.userId);
};

export const signalOnline = async (socket: socketio.Socket) => {
  try {
    const tokenData = await socketGuard(socket);

    if (!tokenData) return;

    const user = await UserEntity.findById(tokenData.userId);

    if (!user) {
      socket.disconnect(true);
      return;
    }

    user.chatGroups.forEach((chatGroup) =>
      socket.to(chatGroup._id.toString()).emit("online", tokenData.userId)
    );
  } catch (err) {
    socket.disconnect(true);
  }
};

export const signalOffline = async (socket: socketio.Socket) => {
  try {
    const tokenData = await socketGuard(socket);

    if (!tokenData) return;

    const user = await UserEntity.findById(tokenData.userId);

    if (!user) {
      socket.disconnect(true);
      return;
    }

    user.chatGroups.forEach((chatGroup) =>
      socket.to(chatGroup._id.toString()).emit("offline", tokenData.userId)
    );
  } catch (err) {
    socket.disconnect(true);
  }
};
