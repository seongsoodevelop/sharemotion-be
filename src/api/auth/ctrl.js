import { db_register, db_getByEmail } from "#lib/mysql/api/auth.js";
import dotenv from "dotenv";
import axios from "axios";
import { generateToken } from "#lib/token.js";
import { getCookieSecureOptions } from "#lib/option/cookieOptions.js";

dotenv.config();

export const login = async (ctx, next) => {
  try {
    if (ctx.request.auth) {
      ctx.body = { profile: { ...ctx.request.auth.profile } };
      return next();
    }

    const { token } = ctx.request.body;

    if (!token) {
      ctx.throw(400);
    }

    let kakaoAccount = null;
    await axios
      .post(
        `https://kapi.kakao.com/v2/user/me`,
        {},
        {
          headers: {
            "content-type": "application/x-www-form-urlencoded;charset=utf-8",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        kakaoAccount = res.data.kakao_account;
      });

    let auth = null;
    await db_getByEmail(kakaoAccount.email).then((res) => {
      if (res.length === 1) {
        auth = res[0];
      }
    });

    if (auth === null) {
      // register
      await db_register({ email: kakaoAccount.email, token });
      await db_getByEmail(kakaoAccount.email).then((res) => {
        if (res.length === 1) {
          auth = res[0];
        }
      });
    }

    // login
    let jwtToken = null;
    const profile = {
      id: auth.id,
      nickname: auth.nickname,
      create_at: auth.create_at,
      email: auth.email,
    };
    try {
      jwtToken = await generateToken({
        id: auth.id,
        profile,
      });
    } catch (e) {
      ctx.throw(500, e);
    }
    // ctx.cookies.set(
    //   "access_token",
    //   jwtToken,
    //   getCookieSecureOptions(process.env.NODE_ENV === "production")
    // );
    ctx.body = { profile: profile, access_token: jwtToken };
  } catch (e) {
    ctx.throw(400, e.message);
  }
};
