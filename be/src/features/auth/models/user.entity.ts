import { Schema, model } from "mongoose";

export const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    chatGroups: [{ type: Schema.Types.ObjectId, ref: "ChatGroup" }],
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  this.chatGroups = this.chatGroups.filter((chatGroup) => chatGroup !== null);
  next();
});

const UserEntity = model("User", userSchema);

export default UserEntity;
