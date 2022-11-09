import express from "express";
import Channel from "../models/channel";
import User from "../models/user";

const rootRouter = express.Router();

const getHome = async (req, res) => {
  const userId = res.locals.loggedInUserId;
  const dbUser = await User.findOne({ userId });
  if (dbUser) {
    const userChannel = dbUser.channels;
    //console.log(userChannel);
    return res.render("home", { rooms: userChannel });
  } else {
    return res.render("home");
  }
};

const createRoom = async (req, res) => {
  const { roomName } = req.body;
  const roomExists = await Channel.findOne({ name: roomName });
  const userId = res.locals.loggedInUserId;
  const dbUser = await User.findOne({ userId });
  if (roomExists) {
    return res.status(400).render("home", {
      rooms: [],
      errorMessage: "room already exists",
    });
  }
  await Channel.create({ name: roomName }, (err, channel) => {
    //console.log(channel._id);
    if (err) {
      return res.status(400).render("home", {
        rooms: [],
        errorMessage: "Failed to create room",
      });
    } else {
      Channel.findById(channel._id)
        .populate("members")
        .populate("messages")
        .exec((err, foundChannel) => {
          if (err) {
            return res.status(400).render("home", {
              rooms: [],
              errorMessage: "Failed to create room",
            });
          } else {
            //console.log(foundChannel);
            foundChannel.members.push(dbUser._id);
            foundChannel.save();
            dbUser.channels.push(channel._id);
            dbUser.save();
          }
        });
    }
  });

  return res.redirect("/");
};

rootRouter.get("/", getHome);
rootRouter.post("/", createRoom);

export default rootRouter;
