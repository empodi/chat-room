import express from "express";

const socketio = require("socket.io");
const fs = require("fs");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const PORT = 4000;

app.get("/", (req, res) => {
  fs.readFile("./chat.html", (error, data) => {
    if (error) {
      console.log(error);
      return res.sendStatus(500);
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
});

io.sockets.on("connection", (socket) => {
  socket.on("message", (data) => {
    io.sockets.emit("message", data);
  });
});

const handleListen = () => {
  console.log(`🎸 Server Listening on PORT ${PORT}`);
};

http.listen(PORT, handleListen);
