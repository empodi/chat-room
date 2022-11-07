import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  owner: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  date: { type: Date, required: true },
  content: { type: String, required: true },
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
