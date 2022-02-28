import { Request, Response } from "express";
import { inject, injectable, named } from "inversify";
import Controller from "../types/Controller";
import { Get, Post } from "../decorators/ControllerRoute";
import { convertItems, createBaseCurrencies } from "../utils/convertItems";
import { TYPES } from "../ioc/Types";
import PermissionService from "../services/PermissionService";
import { Route } from "../decorators/Route";

@injectable()
@Route("/debug")
export default class DebugController implements Controller {
  public constructor(@inject(TYPES.Service) @named("PermissionService") private permissionService: PermissionService) {}

  public start(): void {
    /* */
  }

  @Post("/convertItems")
  public async mapItems(req: Request, res: Response): Promise<void> {
    try {
      await convertItems();
    } catch (error) {
      console.log(error);
    }
    res.status(200).send();
  }

  @Post("/createBaseCurrencies")
  public async createBaseCurrencies(req: Request, res: Response): Promise<void> {
    try {
      await createBaseCurrencies();
    } catch (error) {
      console.log(error);
    }
    res.status(200).send();
  }

  @Post("/createPermission")
  public async createPermission(req: Request, res: Response): Promise<void> {
    const {
      body: { name, shortName, description },
    } = req;

    const newPermission = await this.permissionService.createPermission(name, shortName, description);
    res.status(201).send(newPermission);
  }

  @Get("/permissions")
  public async getPermissions(req: Request, res: Response): Promise<void> {
    const permissions = await this.permissionService.getPermissions();
    res.status(200).send(permissions);
  }

  @Get("/testAuth")
  public async testAuth(req: Request, res: Response): Promise<void> {
    res.status(200).send();
  }
}
