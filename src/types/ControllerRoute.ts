type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type RouteOptions = {
  [index: string]: any;

  body?: { required: Array<string> };
  params?: { required: Array<string> };
  headers?: { required: Array<string> };
  uploadFiles?: boolean;

  requireToken?: boolean;
};

export interface RouteType {
  path: string;

  httpMethod: HttpMethod;

  methodName: string | symbol;

  middleware?: Function[];

  propertyKey?: string | symbol;

  routeOptions?: RouteOptions;
}

const ControllerRoute = (method: HttpMethod) => {
  return (path: string, routeOptions?: RouteOptions): MethodDecorator => {
    // target = class
    // propertyKey = decorated Method
    return (target, propertyKey: string | symbol): void => {
      if (!Reflect.hasMetadata("routes", target.constructor)) {
        Reflect.defineMetadata("routes", [], target.constructor);
      }

      const routes = Reflect.getMetadata("routes", target.constructor) as Array<RouteType>;

      routes.push({
        httpMethod: method,
        path,
        methodName: propertyKey,
        propertyKey,
        routeOptions,
      });

      Reflect.defineMetadata("routes", routes, target.constructor);
    };
  };
};

export const Get = ControllerRoute("GET");
export const Post = ControllerRoute("POST");
export const Put = ControllerRoute("PUT");
export const Patch = ControllerRoute("PATCH");
export const Delete = ControllerRoute("DELETE");
