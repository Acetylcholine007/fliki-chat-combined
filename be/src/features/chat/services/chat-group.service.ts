import { Request, Response, NextFunction } from "express";
import { HttpException } from "../../../common/models/http-exception.model";
import ChatGroupEntity from "../models/chat-group.entity";
import UserEntity from "../../auth/models/user.entity";
import ChatEntity from "../models/chat.entity";
import mongoose from "mongoose";
import { io } from "../../../index";

export const getChatGroups = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = req.query.query;
    const skip = +(req.query.skip ?? 0);
    const limit = +(req.query.limit ?? 0);

    const totalItems = await ChatGroupEntity.find(
      query
        ? {
            name: { $regex: query, $options: "i" },
          }
        : {}
    ).countDocuments();
    const chatGroups = await ChatGroupEntity.find(
      query
        ? {
            name: { $regex: query, $options: "i" },
          }
        : {}
    )
      .sort({ updatedAt: "desc" })
      .skip(skip)
      .limit(limit)
      .select("-participants -chats -recentUser -recentMessage")
      .populate({ path: "recentUser", select: "-password" });

    res.status(200).json({
      message: "Chat groups fetched",
      data: { chatGroups, totalItems },
    });
  } catch (err) {
    if (err instanceof HttpException) next(err);
    if (err instanceof Error) {
      next(HttpException.toHTTPException(err));
    }
    next(err);
  }
};

export const getExternalChatGroups = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = req.query.query;
    const skip = +(req.query.skip ?? 0);
    const limit = +(req.query.limit ?? 0);

    const user = await UserEntity.findById(req.userId);
    if (user == null) throw new HttpException("User data not found", 404);

    const totalItems = await ChatGroupEntity.find(
      query
        ? {
            name: { $regex: query, $options: "i" },
            _id: { $nin: user.chatGroups },
          }
        : {
            _id: { $nin: user.chatGroups },
          }
    ).countDocuments();
    const chatGroups = await ChatGroupEntity.find(
      query
        ? {
            name: { $regex: query, $options: "i" },
            _id: { $nin: user.chatGroups },
          }
        : {
            _id: { $nin: user.chatGroups },
          }
    )
      .sort({ updatedAt: "desc" })
      .skip(skip)
      .limit(limit)
      .select("-participants -chats -recentUser -recentMessage")
      .populate({
        path: "chats",
        options: { sort: { createdAt: "desc" }, limit: 1 },
        populate: {
          path: "sender",
          select: "-password -chatGroups",
        },
      });

    res.status(200).json({
      message: "Chat groups fetched",
      data: { chatGroups, totalItems },
    });
  } catch (err) {
    if (err instanceof HttpException) next(err);
    if (err instanceof Error) {
      next(HttpException.toHTTPException(err));
    }
    next(err);
  }
};

export const getChatGroup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const chatGroupId = req.params.chatGroupId;

    const chatGroup = await ChatGroupEntity.findById(chatGroupId)
      .populate({
        path: "participants",
        select: "-password",
      })
      .populate({
        path: "chats",
        populate: {
          path: "sender",
          select: "-password -chatGroups",
        },
        options: {
          sort: { createdAt: "desc" },
        },
      });

    if (chatGroup == null) throw new HttpException("No chat found", 404);

    res.status(200).json({
      message: "Chat group fetched",
      data: chatGroup,
    });
  } catch (err) {
    if (err instanceof HttpException) next(err);
    if (err instanceof Error) {
      next(HttpException.toHTTPException(err));
    }
    next(err);
  }
};

export const createChatGroup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const name = req.body.name;
    const creatorId = req.userId;

    const user = await UserEntity.findById(creatorId);

    if (user == null) throw new HttpException("User data not found", 404);

    const chatGroup = new ChatGroupEntity({
      creator: creatorId,
      name,
      participants: [user],
    });

    const session = await mongoose.startSession();
    session.startTransaction();

    user.chatGroups.push(chatGroup._id);

    await chatGroup.save({ session });
    await user.save({ session });
    await session.commitTransaction();

    io.emit("create-group", chatGroup);

    res.status(200).json({
      message: "Chat group created",
      data: chatGroup,
    });
  } catch (err) {
    if (err instanceof HttpException) next(err);
    if (err instanceof Error) {
      next(HttpException.toHTTPException(err));
    }
    next(err);
  }
};

export const updateChatGroup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const chatGroupId = req.params.chatGroupId;
    const name = req.body.name;

    const chatGroup = await ChatGroupEntity.findById(chatGroupId).select(
      "-participants -chats"
    );

    if (chatGroup == null) {
      throw new HttpException("Chat group does not exist", 404);
    }

    if (!chatGroup.creator._id.equals(req.userId)) {
      throw new HttpException(
        "You are not allowed to update other's chat group",
        403
      );
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    const chat = new ChatEntity({
      chatGroup: chatGroup._id,
      message: `Group name changed to "${name}"`,
      sender: chatGroup.creator._id,
      isAnnouncement: true,
    });

    await chat.save({ session });
    chatGroup.chats.push(chat.id);
    chatGroup.name = name;
    await chatGroup.save({ session });
    await session.commitTransaction();

    chatGroup.participants.forEach((user) => {
      io.to(user._id.toString()).emit("create-msg", chat);
      io.to(user._id.toString()).emit("update-group", {
        ...chatGroup,
        recentUser: user,
      });
    });

    res.status(200).json({
      message: "Chat group updated",
      data: chatGroup,
    });
  } catch (err) {
    if (err instanceof HttpException) next(err);
    if (err instanceof Error) {
      next(HttpException.toHTTPException(err));
    }
    next(err);
  }
};

export const joinChatGroup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const chatGroupId = req.params.chatGroupId;

    const chatGroup = await ChatGroupEntity.findById(chatGroupId);

    if (chatGroup == null) {
      throw new HttpException("Chat group does not exist", 404);
    }

    if (
      chatGroup.participants.some((participant) =>
        participant._id.equals(req.userId)
      )
    ) {
      throw new HttpException("You are already a participant", 422);
    }

    const user = await UserEntity.findById(req.userId);

    if (user == null) {
      throw new HttpException("Your account does not exist", 404);
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    const chat = new ChatEntity({
      chatGroup: chatGroup._id,
      message: `${user.name} joined the group`,
      sender: user,
      isAnnouncement: true,
    });

    await chat.save({ session });
    chatGroup.chats.push(chat.id);
    chatGroup.participants.push(user.id);
    user.chatGroups.push(chatGroup.id);
    await chatGroup.save({ session });
    await user.save({ session });
    await session.commitTransaction();

    const jsonChat = { ...chat.toJSON(), chatGroup: chatGroupId };
    chatGroup.participants.forEach((user) => {
      io.to(user._id.toString()).emit("create-msg", chat);
      io.to(user._id.toString()).emit("update-group", {
        ...chatGroup.toJSON(),
        chats: [jsonChat],
        participants: [],
      });
    });

    res.status(200).json({
      message: "You've joined the chat group.",
      data: {
        ...chatGroup.toJSON(),
        chats: [jsonChat],
        participants: [],
      },
    });
  } catch (err) {
    if (err instanceof HttpException) next(err);
    if (err instanceof Error) {
      next(HttpException.toHTTPException(err));
    }
    next(err);
  }
};

export const leaveChatGroup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const chatGroupId = req.params.chatGroupId;

    const user = await UserEntity.findById(req.userId);
    if (user == null) {
      throw new HttpException("Your account does not exist", 404);
    }

    const chatGroup = await ChatGroupEntity.findById(chatGroupId);

    if (chatGroup == null) {
      throw new HttpException("Chat group does not exist", 404);
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    const chat = new ChatEntity({
      chatGroup: chatGroup._id,
      message: `${user.name} left the group`,
      sender: user,
      isAnnouncement: true,
    });

    await chat.save({ session });
    chatGroup.chats.push(chat.id);
    await chatGroup.save({ session });

    await ChatGroupEntity.updateOne(
      { _id: chatGroupId },
      { $pull: { participants: req.userId } },
      { session }
    );
    await UserEntity.updateOne(
      { _id: req.userId },
      { $pull: { chatGroups: chatGroupId } },
      { session }
    );

    await session.commitTransaction();

    const jsonChat = { ...chat.toJSON(), chatGroup: chatGroupId };
    chatGroup.participants.forEach((user) => {
      io.to(user._id.toString()).emit("create-msg", chat);
      io.to(user._id.toString()).emit("update-group", {
        ...chatGroup.toJSON(),
        chats: [jsonChat],
        participants: [],
      });
    });

    res.status(200).json({
      message: "You've left the chat group",
      data: {
        ...chatGroup.toJSON(),
        chats: [jsonChat],
        participants: [],
      },
    });
  } catch (err) {
    if (err instanceof HttpException) next(err);
    if (err instanceof Error) {
      next(HttpException.toHTTPException(err));
    }
    next(err);
  }
};

export const deleteChatGroup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const chatGroupId = req.params.chatGroupId;

    const chatGroup = await ChatGroupEntity.findById(chatGroupId).select(
      "-participants -chats"
    );

    if (chatGroup == null) {
      throw new HttpException("Chat group does not exist", 404);
    }

    const user = await UserEntity.findById(req.userId);

    if (user == null) {
      throw new HttpException("User data does not exist", 404);
    }

    if (!chatGroup.creator._id.equals(req.userId)) {
      throw new HttpException(
        "You are not allowed to delete other's chat group",
        403
      );
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    await ChatEntity.deleteMany(
      { chatGroup: { _id: chatGroupId } },
      { session }
    );
    await ChatGroupEntity.deleteOne({ _id: chatGroupId }, { session });
    await UserEntity.updateOne(
      { _id: req.userId },
      { $pull: { chatGroups: chatGroupId } },
      { session }
    );

    await session.commitTransaction();

    io.emit("delete-group", chatGroup);

    res.status(200).json({
      message: "Chat group deleted",
      data: chatGroup,
    });
  } catch (err) {
    if (err instanceof HttpException) next(err);
    if (err instanceof Error) {
      next(HttpException.toHTTPException(err));
    }
    next(err);
  }
};
