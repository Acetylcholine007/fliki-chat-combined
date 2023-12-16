import { Schema, model } from "mongoose";

export const chatGroupSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    chats: [{ type: Schema.Types.ObjectId, ref: "Chat" }],
  },
  { timestamps: true }
);

const ChatGroupEntity = model("ChatGroup", chatGroupSchema);

export default ChatGroupEntity;
