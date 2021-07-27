import { injectable } from "inversify";
import { Errors, ServerException } from "../error-handling/ErrorCodes";
import AssetPack from "../models/AssetPack";
import User from "../models/User";
import { Service } from "../types/Service";
import { ObjectId } from "../utils/ObjectId";

@injectable()
export default class AssetService implements Service {
  public async start(): Promise<void> {
    /* */
  }

  public async getAssetPacks(): Promise<AssetPack[]> {
    return await AssetPack.find({});
  }

  public async getAssetPack(id: string): Promise<AssetPack> {
    let assetPack: AssetPack | null;
    try {
      assetPack = await AssetPack.findOne({ _id: new ObjectId(id) }).lean();
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR);
    }

    if (!assetPack) {
      throw new ServerException(Errors.RESOURCE_NOT_FOUND);
    }

    return assetPack;
  }

  public async createAssetPack(options: { title: string; description: string; creator: User }): Promise<AssetPack> {
    const { title, description, creator } = options;
    try {
      const assetPack = new AssetPack({ title, description, createdBy: creator, assets: [] });
      await assetPack.save();

      return assetPack;
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR);
    }
  }

  public async deleteAssetPack(id: string): Promise<void> {
    try {
      await AssetPack.deleteOne({ _id: new ObjectId(id) });
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR);
    }
  }
}
