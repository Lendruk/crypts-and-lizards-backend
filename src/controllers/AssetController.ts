import { Response } from "express";
import { inject, injectable, named } from "inversify";
import { Errors, ServerException } from "../error-handling/ErrorCodes";
import { TYPES } from "../ioc/Types";
import AssetService from "../services/AssetService";
import MapService from "../services/MapService";
import Controller from "../types/Controller";
import { Delete, Get, Post, Put } from "../decorators/ControllerRoute";
import { ExpressRequest } from "../types/ExpressRequest";
import { RequireLogin } from "../decorators/RequireAuth";
import { Route } from "../decorators/Route";

@injectable()
@Route("/assets")
export default class AssetController implements Controller {
  constructor(
    @inject(TYPES.Service) @named("AssetService") private assetService: AssetService,
    @inject(TYPES.Service) @named("MapService") private mapService: MapService
  ) {}

  public start(): void {
    /* */
  }

  @Get("/me")
  @RequireLogin()
  public async getAssetPacks(req: ExpressRequest, res: Response): Promise<void> {
    const { user } = req;
    try {
      // const assets = AssetPack.find({ $or: [{ privacy: "PUBLIC" }, { createdBy: user }] });
      const assets = await this.assetService.getMyAssets(user);
      res.status(200).json(assets);
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR, error as Error);
    }
  }

  @Get("/:id/maps")
  @RequireLogin()
  public async getAssetPackMaps(req: ExpressRequest, res: Response): Promise<void> {
    const {
      user,
      params: { id },
    } = req;
    try {
      const maps = await this.mapService.getMapsForPack(user, id);
      res.status(200).json(maps);
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR, error as Error);
    }
  }

  @Get("/:id")
  @RequireLogin()
  public async getAssetPack(req: ExpressRequest, res: Response): Promise<void> {
    const {
      params: { id },
    } = req;
    const asset = await this.assetService.getAssetPack(id);
    res.status(200).json(asset);
  }

  @Post("/")
  @RequireLogin()
  public async createAssetPack(req: ExpressRequest, res: Response): Promise<void> {
    try {
      const {
        body: { title, description },
        user,
      } = req;

      const assetPack = await this.assetService.createAssetPack({ title, description, creator: user });

      res.status(200).json(assetPack);
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR, error as Error);
    }
  }

  @Put("/:id")
  @RequireLogin()
  public async updateAssetPack(req: ExpressRequest, res: Response): Promise<void> {
    try {
      const {
        body: { title, description, tags },
        params: { id },
        user,
      } = req;
      const assetPack = await this.assetService.updateAssetPack(id, { title, description, tags }, user);

      res.status(200).json(assetPack);
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR, error as Error);
    }
  }

  @Delete("/:id")
  @RequireLogin()
  public async deleteAssetPack(req: ExpressRequest, res: Response): Promise<void> {
    try {
      const {
        params: { id },
        user,
      } = req;

      const asset = await this.assetService.deleteAssetPack(id, user);
      res.status(200).json(asset);
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR, error as Error);
    }
  }
}
