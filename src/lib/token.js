import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateToken = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
      (error, token) => {
        if (error) reject(error);
        resolve(token);
      }
    );
  });
};

export const decodeToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) reject(error);
      resolve(decoded);
    });
  });
};

export const jwtMiddleware = async (ctx, next) => {
  const token = ctx.cookies.get("access_token"); // ctx 에서 access_token 을 읽어옵니다
  if (!token) return next(); // 토큰이 없으면 바로 다음 작업을 진행합니다.

  try {
    const decoded = await decodeToken(token); // 토큰을 디코딩 합니다

    // 토큰 만료일이 하루밖에 안남으면 토큰을 재발급합니다
    if (Date.now() / 1000 - decoded.iat > 60 * 60 * 24) {
      // 하루가 지나면 갱신해준다.
      const { id, profile } = decoded;
      const freshToken = await generateToken({ id, profile });
      ctx.cookies.set("access_token", freshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7days
        httpOnly: true,
      });
    }

    // ctx.request.auth 에 디코딩된 값을 넣어줍니다
    ctx.request.auth = decoded;
  } catch (e) {
    // token validate 실패
    ctx.request.auth = null;
  }

  return next();
};

export const jwtMiddlewareStorage = async (ctx, next) => {
  const token = ctx.request.body.access_token; // ctx 에서 access_token 을 읽어옵니다
  if (!token) return next(); // 토큰이 없으면 바로 다음 작업을 진행합니다.

  try {
    const decoded = await decodeToken(token); // 토큰을 디코딩 합니다

    // ctx.request.auth 에 디코딩된 값을 넣어줍니다
    ctx.request.auth = decoded;
  } catch (e) {
    // token validate 실패
    ctx.request.auth = null;
  }

  return next();
};
