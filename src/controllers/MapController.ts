import { Response } from "express";
import { inject, injectable, named } from "inversify";
import { Errors, ServerException } from "../error-handling/ErrorCodes";
import { TYPES } from "../ioc/Types";
import MapService from "../services/MapService";
import Controller from "../types/Controller";
import { Delete, Get, Post, Put } from "../decorators/ControllerRoute";
import { ExpressRequest } from "../types/ExpressRequest";
import { RequireLogin } from "../decorators/RequireAuth";
import { Route } from "../decorators/Route";
import { ObjectId } from "../utils/ObjectId";

@injectable()
@Route("/maps")
export default class MapController implements Controller {
  constructor(@inject(TYPES.Service) @named("MapService") private mapService: MapService) {}

  public start(): void {
    /* */
  }

  @Get("/templates/me")
  @RequireLogin()
  public async getMyTemplates(req: ExpressRequest, res: Response): Promise<void> {
    const { user } = req;
    try {
      const maps = await this.mapService.getMyTemplates(user);
      res.status(200).json(maps);
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR, error as Error);
    }
  }

  @Post("/templates")
  @RequireLogin()
  public async createTemplate(req: ExpressRequest, res: Response): Promise<void> {
    try {
      const { user, body } = req;
      const map = await this.mapService.createTemplate({ creator: user, ...body });
      res.status(201).json(map);
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR, error as Error);
    }
  }

  @Put("/templates/:id")
  public async updateTemplate(req: ExpressRequest, res: Response): Promise<void> {
    try {
      const {
        params: { id },
        body,
      } = req;
      await this.mapService.updateTemplate(new ObjectId(id), body);
      res.status(200).send();
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR, error as Error);
    }
  }

  @Delete("/templates/:id")
  @RequireLogin()
  public async deleteTemplate(req: ExpressRequest, res: Response): Promise<void> {
    try {
      const {
        user,
        params: { id },
      } = req;
      await this.mapService.deleteTemplate(user, id);
      res.status(200).send();
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR, error as Error);
    }
  }
}
