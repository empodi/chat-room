import express from "express";

const app = express();
const PORT = 4000;

app.get("/", (req, res) => {
  return res.send("SERVER!!");
});

const handleListen = () => {
  console.log(`🎸 Server Listening on PORT ${PORT}`);
};

app.listen(PORT, handleListen);
