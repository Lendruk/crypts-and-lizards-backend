import { injectable } from "inversify";
import { Document, Schema } from "mongoose";
import AbstractModel from "../../types/AbstractModel";
import { ObjectId } from "../../utils/ObjectId";
import { PermissionGroup, PermissionGroupCollection } from "../Permission";
import { RoleCollection } from "../Role";
import { Tag, TagCollection } from "../Tag";
import { User, UserCollection } from "../User";
import { Asset } from "./Asset";

type AssetPackPrivacy = "PUBLIC" | "PRIVATE";

export interface AssetPack {
  title: string;
  description: string;
  assets: Asset[];
  privacy: AssetPackPrivacy;
  createdBy: User;
  tags: Tag[];
  roles: string[];
  customPermissionGroups: PermissionGroup[] | ObjectId[];
}

interface AssetPackModel extends AssetPack, Document {}
@injectable()
export class AssetPackCollection extends AbstractModel<AssetPack, AssetPackModel> {
  public constructor() {
    super({
      title: { type: String },
      tags: [{ type: Schema.Types.ObjectId, ref: TagCollection }],
      description: { type: String, default: "" },
      assets: [{ type: ObjectId, ref: "assets" }],
      createdBy: { type: Schema.Types.ObjectId, ref: UserCollection },
      privacy: { type: String, enum: ["PRIVATE", "PUBLIC"], default: "PRIVATE" },
      roles: [{ type: Schema.Types.ObjectId, ref: RoleCollection }],
      customPermissionGroups: [{ type: Schema.Types.ObjectId, ref: PermissionGroupCollection }],
    });
  }
}
