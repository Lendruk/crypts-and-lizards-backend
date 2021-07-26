import { NextFunction, Request, Response } from "express";
import { Exception } from "./ErrorCodes";

export function errorHandler(
  error: Exception,
  _: Request,
  response: Response,
  __: NextFunction
): Response<any, Record<string, any>> {
  const { httpCode, message } = error;
  return response.status(httpCode).send({ message });
}

export const errorCatcher =
  (fn: any) =>
  (req: Request, res: Response, next: NextFunction): Promise<any> => {
    return Promise.resolve(fn(req, res, next)).catch((err: any) => next(err));
  };
