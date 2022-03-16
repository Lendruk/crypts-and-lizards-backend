import { Document, Schema } from "mongoose";
import AbstractModel from "../types/AbstractModel";
import { ObjectId } from "../utils/ObjectId";
import { AssetPack, AssetPackCollection } from "./Assets/AssetPack";
import { PermissionGroup, PermissionGroupCollection } from "./Permission";
import { RoleCollection } from "./Role";
import { Tag, TagCollection } from "./Tag";
import { UserCollection } from "./User";

export interface Campaign {
  id?: any;
  title: string;
  description: string;
  tags: Tag[];
  assetPacks: AssetPack[];
  forkedFrom: Campaign;
  createdBy: string;
  roles: string[];
  customPermissionGroups: PermissionGroup[] | ObjectId[];
}

interface CampaignModel extends Campaign, Document {}
export class CampaignCollection extends AbstractModel<Campaign, CampaignModel> {
  public constructor() {
    super({
      title: { type: String },
      description: { type: String },
      forkedFrom: { type: Schema.Types.ObjectId, ref: CampaignCollection },
      assetPacks: [{ type: Schema.Types.ObjectId, ref: AssetPackCollection }],
      tags: [{ type: Schema.Types.ObjectId, ref: TagCollection }],
      createdBy: { type: Schema.Types.ObjectId, ref: UserCollection },
      roles: [{ type: Schema.Types.ObjectId, ref: RoleCollection }],
      customPermissionGroups: [{ type: Schema.Types.ObjectId, ref: PermissionGroupCollection }],
    });
  }
}
