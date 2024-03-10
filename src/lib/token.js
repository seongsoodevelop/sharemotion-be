import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { getCookieSecureOptions } from "#lib/option/cookieOptions.js";

dotenv.config();

const jwt_secret = process.env.JWT_SECRET;

export const generateToken = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      jwt_secret,
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
  const token = ctx.cookies.get("access_token"); // ctx 에서 access_token 을 읽어오기
  if (!token) return next(); // 토큰이 없으면 바로 다음 작업을 진행

  try {
    const decoded = await decodeToken(token); // 토큰을 디코딩

    // 토큰 만료일이 하루밖에 안남으면 토큰을 재발급
    if (Date.now() / 1000 - decoded.iat > 60 * 60 * 24) {
      // 하루가 지나면 갱신
      const { id, profile } = decoded;
      const freshToken = await generateToken({ id, profile });
      ctx.cookies.set(
        "access_token",
        freshToken,
        getCookieSecureOptions(process.env.NODE_ENV === "production")
      );
    }

    // ctx.request.auth 에 디코딩된 값을 넣어주기
    ctx.request.auth = decoded;
  } catch (e) {
    // token validate 실패
    ctx.request.auth = null;
  }

  return next();
};

export const jwtMiddlewareStorage = async (ctx, next) => {
  const token = ctx.request.body.access_token; // ctx 에서 access_token 을 읽어오기
  if (!token) return next(); // 토큰이 없으면 바로 다음 작업을 진행

  try {
    const decoded = await decodeToken(token); // 토큰을 디코딩
    let freshToken = token;

    if (Date.now() / 1000 - decoded.iat > 60 * 60 * 24) {
      // 하루가 지나면 갱신
      const { id, profile } = decoded;
      freshToken = await generateToken({ id, profile });
    }

    // ctx.request.auth 에 디코딩된 값을 넣어주기
    ctx.request.auth = { ...decoded, token: freshToken };
  } catch (e) {
    // token validate 실패
    ctx.request.auth = null;
  }

  return next();
};
