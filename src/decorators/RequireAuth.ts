import { NextFunction, Response } from "express-serve-static-core";
import app from "../App";
import { Errors, ServerException } from "../error-handling/ErrorCodes";
import AuthService from "../services/AuthService";
import { ExpressRequest } from "../types/ExpressRequest";
import { getOrCreateMiddleware } from "./utils";

export const verifyToken = async (req: ExpressRequest, _: Response, next: NextFunction): Promise<void> => {
  try {
    const { accesstoken } = req.headers;
    if (!accesstoken) throw new ServerException(Errors.AUTH.NO_TOKEN);

    const splitToken: string[] = (accesstoken as string).split(" ");

    if (splitToken[0] !== "Bearer" || splitToken[1] == null || splitToken[1] == "null")
      throw new ServerException(Errors.AUTH.INVALID_TOKEN);

    const authService = app.container.getNamed<AuthService>(AuthService, "AuthService");
    const foundUser = await authService.verifyToken(splitToken[1]);

    if (!foundUser) {
      throw new ServerException(Errors.AUTH.INVALID_TOKEN);
    } else {
      req.user = foundUser;
    }
  } catch (err) {
    throw err;
  }

  next();
};

export const RequireLogin = (): MethodDecorator => {
  // target = class
  // propertyKey = decorated method key
  return (target, propertyKey: string | symbol): void => {
    const middleware = getOrCreateMiddleware(target);
    middleware.set(propertyKey as string, [verifyToken]);
  };
};
