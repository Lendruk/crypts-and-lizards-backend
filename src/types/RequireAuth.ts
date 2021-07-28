import { NextFunction, Response } from "express-serve-static-core";
import { Errors, ServerException } from "../error-handling/ErrorCodes";
import User from "../models/User";
import AuthService from "../services/AuthService";
import { ExpressFunction } from "./ExpressFunction";
import { ExpressRequest } from "./ExpressRequest";

const checkToken = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { authorization } = req.headers;
    if (!authorization) throw new ServerException(Errors.AUTH.NO_TOKEN);

    const splitToken: string[] = authorization.split(" ");

    if (splitToken[0] !== "Bearer" || splitToken[1] == null || splitToken[1] == "null")
      throw new ServerException(Errors.AUTH.INVALID_TOKEN);

    const foundUser = await AuthService.verifyToken(splitToken[1]);

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

export const RequireAuth = (permission?: string): MethodDecorator => {
  // target = class
  // propertyKey = decorated Method
  return (target, propertyKey: string | symbol): void => {
    if (!Reflect.hasMetadata("middleware", target.constructor)) {
      Reflect.defineMetadata("middleware", new Map(), target.constructor);
    }

    const middleware = Reflect.getMetadata("middleware", target.constructor) as Map<string | symbol, ExpressFunction[]>;

    middleware.set(propertyKey as string, [checkToken]);
  };
};
