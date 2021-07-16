import "reflect-metadata";
import express, { NextFunction, Request, Response, Router } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import * as core from 'express-serve-static-core';
import Controller from './src/types/Controller';
config();
import './src/database/Database';
import { Container } from 'inversify';
import { TYPES } from './src/ioc/Types';
import ControllerModule from './src/ioc/containers/ControllerModule';
import { RouteType } from "./src/types/ControllerRoute";
import ServiceModule from "./src/ioc/containers/ServiceModule";
import { errorCatcher, errorHandler } from "./src/error-handling/ErrorHandler";
import { Errors, Exception } from "./src/error-handling/ErrorCodes";

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
  }

  private startServices(): void {
    Promise.all([
      ServiceModule.start(this.container),
      ControllerModule.start(this.container)
    ]);
  }

  private buildRoutes(): void {
    const controllers = this.container.getAll<Controller>(TYPES.Controller);
    for(const controller of controllers) {
      if(Reflect.hasMetadata("routes", controller.constructor)) {
        const routes = Reflect.getMetadata("routes", controller.constructor) as RouteType[];

        for(const route of routes) {
          this.buildRoute(route, controller);
        }
      }
    }  

    this.router.use((_: Request, __: Response, next: NextFunction) => {
      next(new Exception(Errors.NOT_FOUND));
    });
    
    this.router.use(errorHandler);

    this.expressApp.use('/api', this.router);
  }

  private buildRoute(routeOptions: RouteType, controller: Controller): void {
    this.router[routeOptions.httpMethod.toLowerCase()](`${controller.getApiPath()}${routeOptions.path}`, errorCatcher(controller[routeOptions.methodName].bind(controller)));
  }

}
const app = new App();
app.listen();

export default app;