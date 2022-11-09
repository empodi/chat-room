const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const redisClient = require("./cache");

const jwtSecret = "abcde";

const client = {
  sign: (user) => {
    //access token 발급
    const payload = {
      //user custom
      id: user.userId, // email을 ID로 사용
      nick: user.nickname,
    };

    return jwt.sign(payload, jwtSecret, {
      algorithm: "HS256",
      expiresIn: "1h",
    });
  },
  verify: (token) => {
    //access token 검증
    let decoded = null;
    try {
      decoded = jwt.verify(token, jwtSecret);
      return {
        //user custom
        ok: true,
        id: decoded.id,
        nick: decoded.nick,
      };
    } catch (err) {
      return {
        ok: false,
        message: err.message,
      };
    }
  },
  refresh: () => {
    //refresh token 발급
    return jwt.sign({}, jwtSecret, {
      algorithm: "HS256",
      expiresIn: "14d",
    });
  },
  refreshVerify: async (token, userId) => {
    //refresh token 검증 ??
    const getAsync = promisify(redisClient.get).bind(redisClient); //??
    try {
      const data = await getAsync(userId);
      if (token === data) {
        try {
          jwt.verify(token, jwtSecret);
          return true;
        } catch (err) {
          return false;
        }
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  },
};

export default client;
