import express from "express";
import User from "../models/user";
import { redisCli, get, set } from "../config/cache";
import client from "../config/jwt";

const authRouter = express.Router();

const getRegister = (req, res) => {
  return res.render("register");
};

const postRegister = async (req, res) => {
  // ID가 email
  //console.log(req.body);
  const { userId, nickname, password, confirmPassword } = req.body;
  const userExists = await User.exists({ userId });

  if (userExists) {
    return res.status(400).render("register", {
      errorMessage: "이미 존재하는 아이디입니다.",
    });
  }
  if (password !== confirmPassword) {
    return res.status(400).render("register", {
      errorMessage: "password confirmation fail",
    });
  }
  try {
    console.log("register: ", userId, nickname, password);
    await User.create({
      userId,
      nickname,
      password,
    });
    console.log("register OK");
    return res.redirect("/");
  } catch (err) {
    return res.status(400).render("register", { errorMessage: err });
  }
  //return res.json({ message: "Hahahaha", loggedIn: false });
};

const getLogin = async (req, res) => {
  return res.render("login");
};

const postLogin = async (req, res) => {
  console.log("SERVER:LOGIN!!");
  //console.log(req.body);
  const { userId, password } = req.body;
  const user = await User.findOne({ userId });
  if (!user) {
    return res.status(400).render("login", {
      errorMessage: "Username doesn't exist",
    });
  }
  if (user.password !== password) {
    return res
      .status(400)
      .render("login", { errorMessage: "password confirmation fail" });
  }
  //console.log(user);
  const accessToken = client.sign(user);
  const refreshToken = client.refresh();
  console.log(`refreshToken : ${refreshToken}`);
  res.cookie("token", accessToken);
  await redisCli.set(userId, refreshToken);
  /*
  const ret = await redisCli.get(userId);
  console.log("from redisCli: ", ret);
  */
  return res.redirect("/");
  /*
  return res.json({
    message: "NOPE",
    loggedIn: false,
    user: req.user,
  });
  */
};

const handleLogout = (req, res) => {
  res.clearCookie("token").status(200).redirect("/");
};

authRouter.get("/register", getRegister);
authRouter.post("/register", postRegister);
authRouter.get("/login", getLogin);
authRouter.post("/login", postLogin);
authRouter.get("/logout", handleLogout);

export default authRouter;
