export const getCookieSecureOptions = (isProduction) => {
  if (isProduction) {
    return {
      sameSite: "Lax",
      secure: true,
      // httpOnly: true,
      httpOnly: false,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    };
  } else {
    return {
      // httpOnly: true,
      httpOnly: false,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    };
  }
};
