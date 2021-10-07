import { injectable } from "inversify";
import { Errors, ServerException } from "../error-handling/ErrorCodes";
import AssetPack from "../models/AssetPack";
import Tag from "../models/Tag";
import User from "../models/User";
import { Service } from "../types/Service";
import { ObjectId } from "../utils/ObjectId";

type PartialAssetPack = {
  title: string;
  description: string;
  tags: Tag[];
};

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
      const assets = await AssetPack.find({ createdBy: user }).populate("tags").lean();
      return assets;
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR);
    }
  }

  public async getAssetPack(id: string): Promise<AssetPack> {
    let assetPack: AssetPack | null;
    try {
      assetPack = await AssetPack.findOne({ _id: new ObjectId(id) })
        .populate("tags")
        .lean();
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR);
    }

    if (!assetPack) {
      throw new ServerException(Errors.RESOURCE_NOT_FOUND);
    }

    return assetPack;
  }

  public async updateAssetPack(id: string, updatePayload: PartialAssetPack, user: User): Promise<AssetPack> {
    let assetPack: AssetPack | null;

    try {
      const finalTagPayload: Tag[] = [];
      if (updatePayload.tags) {
        for (const tag of updatePayload.tags) {
          if (tag._id) {
            finalTagPayload.push(tag);
          } else {
            const newTag = new Tag({ name: tag.name });
            await newTag.save();
            finalTagPayload.push(newTag);
          }
        }
      }
      updatePayload.tags = finalTagPayload;
      assetPack = await AssetPack.findOneAndUpdate({ _id: new ObjectId(id), createdBy: user }, updatePayload, {
        new: true,
      }).lean();
    } catch (error) {
      console.log(error);
      throw new ServerException(Errors.SERVER_ERROR);
    }

    if (!assetPack) {
      throw new ServerException(Errors.RESOURCE_NOT_FOUND);
    }

    return assetPack;
  }

  public async createAssetPack(options: { title: string; description?: string; creator: User }): Promise<AssetPack> {
    const { title, creator, description } = options;
    try {
      const assetPack = new AssetPack({ title, description: description || null, createdBy: creator._id });
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
