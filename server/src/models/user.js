import mongoose, { Mongoose } from "mongoose";

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  nickname: { type: String, require: true, unique: true },
  password: { type: String, required: true },
  channels: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
    },
  ],
});

const User = mongoose.model("User", userSchema);

export default User;
