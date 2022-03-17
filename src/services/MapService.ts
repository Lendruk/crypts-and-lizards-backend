import { inject, injectable, named } from "inversify";
import { Errors, ServerException } from "../error-handling/ErrorCodes";
import { TYPES } from "../ioc/Types";
import { MapTemplate, MapTemplateCollection } from "../models/MapTemplate";
import { User } from "../models/User";
import { Factory } from "../types/Factory";
import { Service } from "../types/Service";
import { ObjectId } from "../utils/ObjectId";

@injectable()
export default class MapService implements Service {
  public constructor(
    @inject(TYPES.Model) @named("MapTemplateCollection") private mapTemplateCollection: MapTemplateCollection,
    @inject(TYPES.ObjectId) private objectIdFactory: Factory<string, ObjectId>
  ) {}

  public async start(): Promise<void> {
    /* */
  }

  public async getMyTemplates(user: User): Promise<MapTemplate[]> {
    try {
      const maps = await this.mapTemplateCollection.queryByField({ createdBy: user }).lean();
      return maps;
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR, error as Error);
    }
  }

  public async getMap(id: string, user: User): Promise<MapTemplate> {
    let map: MapTemplate | null;
    try {
      map = await this.mapTemplateCollection.findOne({ createdBy: user, _id: this.objectIdFactory(id) });
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR, error as Error);
    }

    if (!map) {
      throw new ServerException(Errors.RESOURCE_NOT_FOUND);
    }

    return map;
  }

  public async getMapsForPack(user: User, packId: string): Promise<MapTemplate[]> {
    try {
      return await this.mapTemplateCollection.aggregate([
        {
          $match: {
            createdBy: this.objectIdFactory(user.id),
            assetPacks: this.objectIdFactory(packId),
          },
        },
        {
          $project: {
            title: 1,
            _id: 1,
          },
        },
      ]);
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR, error as Error);
    }
  }

  public async updateTemplate(templateId: ObjectId, updatePayload: Partial<MapTemplate>): Promise<void> {
    try {
      await this.mapTemplateCollection.findOneAndUpdate({ _id: templateId }, updatePayload);
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR, error as Error);
    }
  }

  public async createTemplate(options: {
    title: string;
    description: string;
    assetPack: string;
    creator: User;
  }): Promise<MapTemplate> {
    const { title, creator, description, assetPack } = options;
    try {
      if (!assetPack) throw new ServerException(Errors.MISSING_PARAMS("assetPack"));
      if (!title) throw new ServerException(Errors.MISSING_PARAMS("title"));

      const map = await this.mapTemplateCollection.save({
        title,
        description,
        assetPacks: [this.objectIdFactory(assetPack)],
        createdBy: this.objectIdFactory(creator.id),
      });

      return map;
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR, error as Error);
    }
  }

  public async deleteTemplate(user: User, mapId: string): Promise<void> {
    try {
      await this.mapTemplateCollection.deleteByField({ _id: this.objectIdFactory(mapId), creator: user });
    } catch (error) {
      throw new ServerException(Errors.RESOURCE_NOT_FOUND, error as Error);
    }
  }
}
