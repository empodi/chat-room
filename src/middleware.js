import client from "./config/jwt";

export const Authenticator = async (req, res, next) => {
  //console.log(res.cookie());
  //console.log(req.cookies.token);
  const jwtResult = await client.verify(req.cookies.token);
  //console.log(jwtResult);
  res.locals.loggedIn = jwtResult.ok;
  res.locals.loggedInUserId = jwtResult.id;
  res.locals.loggedInUserNick = jwtResult.nick;
  //console.log(res.locals);
  next();
};
