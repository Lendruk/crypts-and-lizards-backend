import { Response } from "express";
import { inject, injectable, named } from "inversify";
import { Errors, ServerException } from "../error-handling/ErrorCodes";
import { TYPES } from "../ioc/Types";
import MapService from "../services/MapService";
import Controller from "../types/Controller";
import { Delete, Get, Post } from "../types/ControllerRoute";
import { ExpressRequest } from "../types/ExpressRequest";
import { RequireAuth } from "../decorators/RequireAuth";

@injectable()
export default class MapController implements Controller {
  private static readonly API_PATH = "/maps";

  constructor(@inject(TYPES.Service) @named("MapService") private mapService: MapService) {}

  public start(): void {
    /* */
  }

  @Get("/me")
  @RequireAuth()
  public async getMyMaps(req: ExpressRequest, res: Response): Promise<void> {
    const { user } = req;
    try {
      const maps = await this.mapService.getMyMaps(user);
      res.status(200).json(maps);
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR, error as Error);
    }
  }

  @Post("/")
  @RequireAuth()
  public async createMap(req: ExpressRequest, res: Response): Promise<void> {
    try {
      const { user, body } = req;

      const map = await this.mapService.createMap({ creator: user, ...body });
      res.status(201).json(map);
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR, error as Error);
    }
  }

  @Delete("/:id")
  @RequireAuth()
  public async deleteMap(req: ExpressRequest, res: Response): Promise<void> {
    try {
      const {
        user,
        params: { id },
      } = req;

      await this.mapService.deleteMap(user, id);

      res.status(200).send();
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR, error as Error);
    }
  }

  public getApiPath(): string {
    return MapController.API_PATH;
  }
}
