import ChatEntity from "../models/chat.entity";
import { Request, Response, NextFunction } from "express";
import { HttpException } from "../../../common/models/http-exception.model";
import ChatGroupEntity from "../models/chat-group.entity";
import UserEntity from "../../auth/models/user.entity";
import mongoose from "mongoose";
import { io } from "../../../index";

export const getChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const chatGroupId = req.query.chatGroupId as string;
    const skip = +(req.query.skip ?? 0);
    const limit = +(req.query.limit ?? 0);

    const totalItems = await ChatEntity.find({
      chatGroup: { _id: chatGroupId },
    }).countDocuments();
    const chats = await ChatEntity.find({ chatGroup: { _id: chatGroupId } })
      .sort({ createdAt: "desc" })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      message: "Chats fetched",
      data: { chats, totalItems },
    });
  } catch (err) {
    if (err instanceof HttpException) next(err);
    if (err instanceof Error) {
      next(HttpException.toHTTPException(err));
    }
    next(err);
  }
};

export const getChat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const chatId = req.params.chatId;

    const chat = await ChatEntity.findById(chatId);

    if (chat == null) throw new HttpException("No chat found", 404);

    res.status(200).json({
      message: "Chat fetched",
      data: chat,
    });
  } catch (err) {
    if (err instanceof HttpException) next(err);
    if (err instanceof Error) {
      next(HttpException.toHTTPException(err));
    }
    next(err);
  }
};

export const createChat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const chatGroupId = req.body.chatGroupId;
    const message = req.body.message;

    const chatGroup = await ChatGroupEntity.findById(chatGroupId).populate({
      path: "chats",
      options: { limit: 0 },
      populate: {
        path: "sender",
        select: "-password -chatGroups",
      },
    });

    if (!chatGroup) {
      throw new HttpException("Chat group does not exist", 404);
    }

    const user = await UserEntity.findById(req.userId).select(
      "-password -chatGroups"
    );
    if (!user) {
      throw new HttpException("User data does not exist", 404);
    }

    const chat = new ChatEntity({
      chatGroup,
      message,
      sender: user,
    });

    const session = await mongoose.startSession();
    session.startTransaction();

    await chat.save({ session });
    chatGroup.chats.push(chat.id);
    await chatGroup.save({ session });

    await session.commitTransaction();

    const jsonChat = { ...chat.toJSON(), chatGroup: chatGroupId };
    chatGroup.participants.forEach((user) => {
      io.to(user._id.toString()).emit("create-msg", jsonChat);
      io.to(user._id.toString()).emit("update-group", {
        ...chatGroup.toJSON(),
        chats: [jsonChat],
        participants: [],
      });
    });

    res.status(200).json({
      message: "Chat created",
      data: jsonChat,
    });
  } catch (err) {
    if (err instanceof HttpException) next(err);
    if (err instanceof Error) {
      next(HttpException.toHTTPException(err));
    }
    next(err);
  }
};

export const deleteChat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const chatId = req.params.chatId;

    const chat = await ChatEntity.findById(chatId);

    if (chat == null) {
      throw new HttpException("Chat does not exist", 404);
    }

    const chatGroup = await ChatGroupEntity.findById(chatId).populate(
      "chatGroup"
    );
    if (chatGroup == null) {
      throw new HttpException("Chat group does not exist", 404);
    }

    const user = await UserEntity.findById(req.userId).select(
      "-password -chatGroups"
    );
    if (!user) {
      throw new HttpException("User data does not exist", 404);
    }

    if (!chat.sender._id.equals(req.userId)) {
      throw new HttpException(
        "You are not allowed to delete other's chat",
        403
      );
    }

    await ChatEntity.deleteOne({ _id: chatId });

    chatGroup.participants.forEach((user) => {
      io.to(user._id.toString()).emit("delete-msg", chat);
      io.to(user._id.toString()).emit("update-group", {
        ...chatGroup,
        recentUser: user,
      });
    });

    res.status(200).json({
      message: "Chat deleted",
      data: chat,
    });
  } catch (err) {
    if (err instanceof HttpException) next(err);
    if (err instanceof Error) {
      next(HttpException.toHTTPException(err));
    }
    next(err);
  }
};
