import "dotenv/config";
import express from "express";
import socket from "socket.io";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import "./db";
import authRouter from "./routers/authRouter";
import rootRouter from "./routers/rootRouter";
import channelRouter from "./routers/channelRouter";
import { Authenticator } from "./middleware";

const app = express();
const PORT = 9876;
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(Authenticator);
app.use("/", rootRouter);
app.use("/api/auth", authRouter);
app.use("/api/channels", channelRouter);

app.get("/", (req, res) => {
  return res.send("SERVER!!");
});

const handleListen = () => console.log(`🎸 Server listening on PORT ${PORT}`);

const server = app.listen(PORT, handleListen);

const io = socket(server, {
  cors: {
    origin: "*", // frontend url
  },
});

// const io = require("socket.io")(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  socket.on("registerAll", (channels) => {
    channels.forEach((channel) => {
      socket.join(channel._id);
    });
  });
  socket.on("register", (channel) => {
    socket.join(channel._id);
  });
  socket.on("messageSent", (channel) => {
    socket.to(channel._id).emit("meesageReceived", channel);
  });
});
