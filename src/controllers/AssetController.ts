import { Response } from "express";
import { Errors, ServerException } from "../error-handling/ErrorCodes";
import AssetPack from "../models/AssetPack";
import Controller from "../types/Controller";
import { Get } from "../types/ControllerRoute";
import { ExpressRequest } from "../types/ExpressRequest";
import { RequireAuth } from "../types/RequireAuth";

export default class AssetController implements Controller {
  private static readonly API_PATH = "/assets";

  public start(): void {
    /* */
  }

  @Get("/")
  @RequireAuth()
  public async getAssetPacks(req: ExpressRequest, res: Response): Promise<void> {
    const { user } = req;
    try {
      const assets = AssetPack.find({ $or: [{ privacy: "PUBLIC" }, { createdBy: user }] });
      res.status(200).json(assets);
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR);
    }
  }

  public getApiPath(): string {
    return AssetController.API_PATH;
  }
}
