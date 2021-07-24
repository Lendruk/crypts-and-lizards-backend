import { NextFunction, Request, Response } from "express-serve-static-core";
import { Errors, ServerException } from "../error-handling/ErrorCodes";
import AuthService from "../services/AuthService";
import { ExpressFunction } from "./ExpressFunction";

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

const checkToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) throw new ServerException(Errors.AUTH.NO_TOKEN);

    const splitToken: string[] = authorization.split(" ");

    if (splitToken[0] !== "Bearer" || splitToken[1] == null || splitToken[1] == "null")
      throw new ServerException(Errors.AUTH.INVALID_TOKEN);

    const isValid = await AuthService.verifyToken(splitToken[1]);

    if(!isValid) {
      throw new ServerException(Errors.AUTH.INVALID_TOKEN);
    }
  } catch (err) {
    throw err;
  }

  next();
};
