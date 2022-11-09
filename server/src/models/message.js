import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  owner: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  SentAt: { type: Date, required: true, default: Date.now },
  content: { type: String, required: true },
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
