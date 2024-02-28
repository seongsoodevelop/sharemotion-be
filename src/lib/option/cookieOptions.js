export const getCookieSecureOptions = (isProduction) => {
  if (isProduction) {
    return {
      sameSite: "none",
      secure: true,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    };
  } else {
    return {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    };
  }
};
