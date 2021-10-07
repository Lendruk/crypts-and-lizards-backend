import { injectable } from "inversify";
import { Errors, ServerException } from "../error-handling/ErrorCodes";
import GameMap from "../models/GameMap";
import User from "../models/User";
import { Service } from "../types/Service";
import { ObjectId } from "../utils/ObjectId";

@injectable()
export default class MapService implements Service {
  public async start(): Promise<void> {
    /* */
  }

  public async getMyMaps(user: User): Promise<GameMap[]> {
    try {
      const maps = await GameMap.find({ createdBy: user }).lean();
      return maps;
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR);
    }
  }

  public async getMap(id: string, user: User): Promise<GameMap> {
    let map: GameMap | null;
    try {
      map = await GameMap.findOne({ createdBy: user, _id: new ObjectId(id) });
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR);
    }

    if (!map) {
      throw new ServerException(Errors.RESOURCE_NOT_FOUND);
    }

    return map;
  }

  public async createMap(options: {
    title: string;
    description: string;
    assetPack: string;
    creator: User;
  }): Promise<GameMap> {
    const { title, creator, description, assetPack } = options;
    try {
      if (!assetPack) throw new ServerException(Errors.MISSING_PARAMS("assetPack"));
      if (!title) throw new ServerException(Errors.MISSING_PARAMS("title"));

      const map = new GameMap({ title, description, assetPacks: [new ObjectId(assetPack)], createdBy: creator._id });
      await map.save();

      return map;
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR);
    }
  }

  public async deleteMap(user: User, mapId: string): Promise<void> {
    try {
      await GameMap.deleteOne({ _id: new ObjectId(mapId), creator: user });
    } catch (error) {
      throw new ServerException(Errors.RESOURCE_NOT_FOUND);
    }
  }
}
