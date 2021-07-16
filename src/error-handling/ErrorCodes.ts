export const Errors = {
  AUTH: {
    NO_TOKEN: {
      httpCode: 401,
      message: "No token",
    },
  },
  MISSING_PARAMS: (param) => ({
    httpCode: 400,
    message: `Missing parameter ${param}`
  }),
};