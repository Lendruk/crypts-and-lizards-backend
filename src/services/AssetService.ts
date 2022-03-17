import { inject, injectable, named } from "inversify";
import { Errors, ServerException } from "../error-handling/ErrorCodes";
import { TYPES } from "../ioc/Types";
import { AssetPack, AssetPackCollection } from "../models/Assets/AssetPack";
import { ResourceField, ResourceTemplate, ResourceTemplateCollection } from "../models/Assets/ResourceTemplate";
import { Tag, TagCollection } from "../models/Tag";
import { User } from "../models/User";
import { Factory } from "../types/Factory";
import { ObjectId } from "../utils/ObjectId";
import UserManagedService from "./generic/UserManagedService";
import PermissionService from "./PermissionService";
import RoleService from "./RoleService";

type PartialAssetPack = {
  title: string;
  description: string;
  tags: Tag[];
};

@injectable()
export default class AssetService extends UserManagedService {
  public constructor(
    @inject(TYPES.Model) @named("AssetPackCollection") private assetPackCollection: AssetPackCollection,
    @inject(TYPES.Model) @named("ResourceTemplateDb") private resourceTemplateDb: ResourceTemplateCollection,
    @inject(TYPES.ObjectId) private objectIdFactory: Factory<string, ObjectId>,
    @inject(TYPES.Service) @named("RoleService") protected roleService: RoleService,
    @inject(TYPES.Service) @named("PermissionService") protected permissionService: PermissionService,
    @inject(TYPES.Model) @named("TagCollection") private tagCollection: TagCollection
  ) {
    super(roleService, permissionService, assetPackCollection);
  }

  public async start(): Promise<void> {
    /* */
  }

  public async getAssetPacks(): Promise<AssetPack[]> {
    return await this.assetPackCollection.all();
  }

  public async getMyAssets(user: User): Promise<AssetPack[]> {
    try {
      const assets = await this.assetPackCollection.queryByField({ createdBy: user.id }).populate("tags").lean();
      return assets;
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR, error as Error);
    }
  }

  public async getAssetPack(id: string): Promise<AssetPack> {
    let assetPack: AssetPack | null;
    try {
      assetPack = await this.assetPackCollection
        .queryOne({ _id: this.objectIdFactory(id) })
        .populate("tags")
        .lean();
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR, error as Error);
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
          if (tag.id) {
            finalTagPayload.push(tag);
          } else {
            const newTag = await this.tagCollection.save({ name: tag.name });
            finalTagPayload.push(newTag);
          }
        }
      }
      updatePayload.tags = finalTagPayload;
      assetPack = await this.assetPackCollection.findOneAndUpdate(
        { _id: this.objectIdFactory(id), createdBy: user.id },
        updatePayload,
        {
          new: true,
        }
      );
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR, error as Error);
    }

    if (!assetPack) {
      throw new ServerException(Errors.RESOURCE_NOT_FOUND);
    }

    return assetPack;
  }

  public async createAssetPack(options: { title: string; description?: string; creator: User }): Promise<AssetPack> {
    const { title, creator, description } = options;
    try {
      const assetPack = await this.assetPackCollection.save(
        {
          title,
          description: description || undefined,
        },
        {
          createdBy: creator.id,
        }
      );
      return assetPack;
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR, error as Error);
    }
  }

  public async deleteAssetPack(id: string, creator: User): Promise<void> {
    try {
      await this.assetPackCollection.deleteByField({ _id: new ObjectId(id), createdBy: new ObjectId(creator.id) });
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR, error as Error);
    }
  }

  public async createResourceTemplate(
    assetPackId: string,
    name: string,
    description: string,
    createdBy: User,
    fields: ResourceField[]
  ): Promise<ResourceTemplate> {
    try {
      const resourceTemplate = await this.resourceTemplateDb.save({ createdBy, name, description, fields });

      return resourceTemplate;
    } catch (error) {
      throw new ServerException(Errors.SERVER_ERROR, error as Error);
    }
  }
}
