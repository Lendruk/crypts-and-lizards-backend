export class Exception extends Error {
  httpCode: number;

  constructor(params: { httpCode: number, message: string }) {
    const { httpCode, message } = params;
    super(message);
    this.message = message;
    this.httpCode = httpCode;
  }
}

export class ServerException extends Exception {
  constructor(params: { httpCode: number, message: string }) {
    super(params);
    Logger.error(this.message);    
  }
}

export const Errors = {
  AUTH: {
    NO_TOKEN: {
      httpCode: 401,
      message: "No token",
    },
    INVALID_CREDS: {
      httpCode: 400,
      message: "Email or password provided are wrong"
    }
  },
  NOT_FOUND: {
    httpCode: 404,
    message: "Resource not found",
  },
  MISSING_PARAMS: (param) => ({
    httpCode: 400,
    message: `Missing parameter ${param}`
  }),
};