import { Schema, model } from "mongoose";

export const chatSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chatGroup: {
      type: Schema.Types.ObjectId,
      ref: "ChatGroup",
      required: true,
    },
    isAnnouncement: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const ChatEntity = model("Chat", chatSchema);

export default ChatEntity;
