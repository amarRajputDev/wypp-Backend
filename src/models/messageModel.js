import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    isSeen: { type: Boolean, default: false },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema); // Capitalized correctly

export default Message;