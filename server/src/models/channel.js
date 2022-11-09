import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
});

const Channel = mongoose.model("Channel", channelSchema);

export default Channel;
