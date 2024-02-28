export const getCorsOptions = (isProduction) => {
  if (isProduction)
    return {
      origin: "https://sharemotion.co.kr",
      credentials: true,
    };
  else
    return {
      // origin: "http://localhost:3000",
      credentials: true,
    };
};
