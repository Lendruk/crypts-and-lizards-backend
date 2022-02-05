import "reflect-metadata";
import express, { NextFunction, Request, Response, Router } from "express";
import cors from "cors";
import { config } from "dotenv";
import * as core from "express-serve-static-core";
import Controller from "./types/Controller";
config();
import "./database/Database";
import { Container } from "inversify";
import { TYPES } from "./ioc/Types";
import ControllerModule from "./ioc/containers/ControllerModule";
import { RouteType } from "./types/ControllerRoute";
import ServiceModule from "./ioc/containers/ServiceModule";
import { errorCatcher, errorHandler } from "./error-handling/ErrorHandler";
import { Errors, Exception } from "./error-handling/ErrorCodes";
import { ExpressFunction } from "./types/ExpressFunction";
import ModelModule from "./ioc/containers/ModelModule";
import ConstantsModule from "./ioc/containers/ConstantsModule";

const PORT = 8080;

// app.use('/api', routes);
class App {
  expressApp: core.Express;
  container: Container;
  router: core.Router;
  constructor() {
    this.expressApp = express();
    this.router = Router();

    this.expressApp.use(cors());
    this.expressApp.use(express.json());
    this.expressApp.use(express.urlencoded({ extended: true }));

    this.container = new Container({ autoBindInjectable: true, skipBaseClassChecks: true });
  }

  public listen(): void {
    this.loadSubContainers();
    this.buildRoutes();
    this.startServices();
    this.expressApp.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  }

  private loadSubContainers(): void {
    this.container.load(ServiceModule.getContainerModule());
    this.container.load(ControllerModule.getContainerModule());
    this.container.load(ModelModule.getContainerModule());
    this.container.load(ConstantsModule.getContainerModule());
  }

  private startServices(): void {
    Promise.all([ServiceModule.start(this.container), ControllerModule.start(this.container)]);
  }

  private buildRoutes(): void {
    const controllers = this.container.getAll<Controller>(TYPES.Controller);
    for (const controller of controllers) {
      if (Reflect.hasMetadata("routes", controller.constructor)) {
        const routes = Reflect.getMetadata("routes", controller.constructor) as RouteType[];

        for (const route of routes) {
          const middyMap = Reflect.getMetadata("middleware", controller.constructor) as Map<
            string | symbol,
            ExpressFunction[]
          >;
          let middyFunctions: ExpressFunction[] = [];
          if (middyMap && middyMap.has(route.methodName)) {
            middyFunctions = middyMap.get(route.methodName)!;
          }

          this.buildRoute(route, controller, middyFunctions);
        }
      }
    }

    this.router.use((_: Request, __: Response, next: NextFunction) => {
      next(new Exception(Errors.NOT_FOUND));
    });

    this.router.use(errorHandler);

    this.expressApp.use("/api", this.router);
  }

  private buildRoute(routeOptions: RouteType, controller: Controller, middleware: ExpressFunction[] = []): void {
    this.router[routeOptions.httpMethod.toLowerCase()](
      `${controller.getApiPath()}${routeOptions.path}`,
      ...middleware.map((middy) => errorCatcher(middy)),
      errorCatcher(controller[routeOptions.methodName].bind(controller))
    );
  }
}
const app = new App();
app.listen();

export default app;
