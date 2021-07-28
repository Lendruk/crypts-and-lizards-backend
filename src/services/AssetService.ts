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

  public async getMyAssets(user: User): Promise<AssetPack[]> {
    try {
      console.log(user);
      const assets = await AssetPack.find({ createdBy: user }).lean();
      return assets;
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR);
    }
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

  public async createAssetPack(options: { title: string; creator: User }): Promise<AssetPack> {
    const { title, creator } = options;
    try {
      const assetPack = new AssetPack({ title, createdBy: creator._id });
      await assetPack.save();

      return assetPack;
    } catch (error) {
      console.log(error);
      throw new ServerException(Errors.SERVER_ERROR);
    }
  }

  public async deleteAssetPack(id: string, creator: User): Promise<void> {
    try {
      await AssetPack.deleteOne({ _id: new ObjectId(id), createdBy: creator });
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR);
    }
  }
}
