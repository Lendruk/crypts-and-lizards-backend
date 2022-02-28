import { ExpressFunction } from "../types/ExpressFunction";

// eslint-disable-next-line @typescript-eslint/ban-types
export const getOrCreateMiddleware = (target: Object): Map<string | symbol, ExpressFunction[]> => {
  if (!Reflect.hasMetadata("middleware", target.constructor)) {
    Reflect.defineMetadata("middleware", new Map(), target.constructor);
  }

  return Reflect.getMetadata("middleware", target.constructor) as Map<string | symbol, ExpressFunction[]>;
};
