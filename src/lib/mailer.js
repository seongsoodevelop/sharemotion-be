import nodemailer from "nodemailer";

import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.cafe24.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: true,
    minVersion: "TLSv1",
  },
});

export const sendMail_verify = (email, code, type) => {
  let options = {};
  switch (type) {
    case "register": {
      options = {
        subject: "[GrowthTopia] Register Verification Code",
        html: `<div>your code is</div><h1>${code}</h1>`,
      };
      break;
    }
    default: {
      options = {
        subject: "[GrowthTopia] Verification Code",
        html: `<div>인증 번호를 입력해주세요</div><h1>${code}</h1>`,
      };
      break;
    }
  }

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    ...options,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      // console.log(error);
    } else {
      // console.log("Email sent: " + info.response);
    }
  });
};
