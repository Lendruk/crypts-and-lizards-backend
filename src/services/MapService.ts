import { injectable } from "inversify";
import { Errors, ServerException } from "../error-handling/ErrorCodes";
import { MapTemplate } from "../models/MapTemplate";
import { User } from "../models/User";
import { Service } from "../types/Service";
import { ObjectId } from "../utils/ObjectId";

@injectable()
export default class MapService implements Service {
  public async start(): Promise<void> {
    /* */
  }

  // public async getMyMaps(user: User): Promise<MapTemplate[]> {
  //   try {
  //     const maps = await GameMap.find({ createdBy: user }).lean();
  //     return maps;
  //   } catch (error) {
  //     throw new ServerException(Errors.SERVER_ERROR, error as Error);
  //   }
  // }

  // public async getMap(id: string, user: User): Promise<MapTemplate> {
  //   let map: MapTemplate | null;
  //   try {
  //     map = await GameMap.findOne({ createdBy: user, _id: new ObjectId(id) });
  //   } catch (error) {
  //     throw new ServerException(Errors.SERVER_ERROR, error as Error);
  //   }

  //   if (!map) {
  //     throw new ServerException(Errors.RESOURCE_NOT_FOUND);
  //   }

  //   return map;
  // }

  // public async getMapsForPack(user: User, packId: string): Promise<MapTemplate[]> {
  //   try {
  //     return await GameMap.aggregate([
  //       {
  //         $match: {
  //           createdBy: new ObjectId(user.id),
  //           assetPacks: new ObjectId(packId),
  //         },
  //       },
  //       {
  //         $project: {
  //           title: 1,
  //           _id: 1,
  //         },
  //       },
  //     ]);
  //   } catch (error) {
  //     throw new ServerException(Errors.SERVER_ERROR, error as Error);
  //   }
  // }

  // public async createMap(options: {
  //   title: string;
  //   description: string;
  //   assetPack: string;
  //   creator: User;
  // }): Promise<MapTemplate> {
  //   const { title, creator, description, assetPack } = options;
  //   try {
  //     if (!assetPack) throw new ServerException(Errors.MISSING_PARAMS("assetPack"));
  //     if (!title) throw new ServerException(Errors.MISSING_PARAMS("title"));

  //     const map = new GameMap({
  //       title,
  //       description,
  //       assetPacks: [new ObjectId(assetPack)],
  //       createdBy: new ObjectId(creator.id),
  //     });
  //     await map.save();

  //     return map;
  //   } catch (error) {
  //     throw new ServerException(Errors.SERVER_ERROR, error as Error);
  //   }
  // }

  // public async deleteMap(user: User, mapId: string): Promise<void> {
  //   try {
  //     await GameMap.deleteOne({ _id: new ObjectId(mapId), creator: user });
  //   } catch (error) {
  //     throw new ServerException(Errors.RESOURCE_NOT_FOUND, error as Error);
  //   }
  // }
}
