import express from "express";
import Channel from "../models/channel";
import User from "../models/user";
import Message from "../models/message";

const channelRouter = express.Router();

const getChannel = async (req, res) => {
  console.log(req.params);
  const room = await Channel.findById(req.params.id);
  //console.log(room);
  return res.json(room);
};

channelRouter.get("/:id", getChannel);

export default channelRouter;
