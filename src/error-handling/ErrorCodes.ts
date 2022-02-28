import Logger from "../utils/Logger";

export class Exception extends Error {
  httpCode: number;

  constructor(params: { httpCode: number; message: string }) {
    const { httpCode, message } = params;
    super(message);
    this.message = message;
    this.httpCode = httpCode;
  }
}

export class ServerException extends Exception {
  constructor(params: { httpCode: number; message: string }, payload?: Error | string) {
    super(params);
    Logger.error(`${this.message} - ${payload}`);
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
      message: "Username or password provided are wrong",
    },
    INVALID_TOKEN: {
      httpCode: 401,
      message: "Invalid token",
    },
    NO_PERMISSION: {
      httpCode: 403,
      message: "No permission to execute this action",
    },
  },
  NOT_FOUND: {
    httpCode: 404,
    message: "Resource not found",
  },
  BAD_REQUEST: {
    httpCode: 400,
    message: "Bad request",
  },
  RESOURCE_NOT_FOUND: {
    httpCode: 404,
    message: "The requested resource was not found",
  },
  MISSING_PARAMS: (param) => ({
    httpCode: 400,
    message: `Missing parameter ${param}`,
  }),
  SERVER_ERROR: {
    httpCode: 500,
    message: "Internal Server Error",
  },
};
