import { Response } from "express";
import { inject, injectable, named } from "inversify";
import { Errors, ServerException } from "../error-handling/ErrorCodes";
import { TYPES } from "../ioc/Types";
import AssetService from "../services/AssetService";
import Controller from "../types/Controller";
import { Delete, Get, Post } from "../types/ControllerRoute";
import { ExpressRequest } from "../types/ExpressRequest";
import { RequireAuth } from "../types/RequireAuth";

@injectable()
export default class AssetController implements Controller {
  private static readonly API_PATH = "/assets";

  constructor(@inject(TYPES.Service) @named("AssetService") private assetService: AssetService) {}

  public start(): void {
    /* */
  }

  @Get("/me")
  @RequireAuth()
  public async getAssetPacks(req: ExpressRequest, res: Response): Promise<void> {
    const { user } = req;
    try {
      // const assets = AssetPack.find({ $or: [{ privacy: "PUBLIC" }, { createdBy: user }] });
      const assets = await this.assetService.getMyAssets(user);
      res.status(200).json(assets);
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR);
    }
  }

  @Post("/")
  @RequireAuth()
  public async createAssetPack(req: ExpressRequest, res: Response): Promise<void> {
    try {
      const {
        body: { title },
        user,
      } = req;

      const asset = await this.assetService.createAssetPack({ title, creator: user });

      res.status(200).json(asset);
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR);
    }
  }

  @Delete("/:id")
  @RequireAuth()
  public async deleteAssetPack(req: ExpressRequest, res: Response): Promise<void> {
    try {
      const {
        params: { id },
        user,
      } = req;

      const asset = await this.assetService.deleteAssetPack(id, user);
      res.status(200).json(asset);
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR);
    }
  }

  public getApiPath(): string {
    return AssetController.API_PATH;
  }
}