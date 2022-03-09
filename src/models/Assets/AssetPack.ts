import { injectable } from "inversify";
import { Document, Schema } from "mongoose";
import AbstractModel from "../../types/AbstractModel";
import { ObjectId } from "../../utils/ObjectId";
import { PermissionGroup } from "../Permission";
import Tag from "../Tag";
import { User } from "../User";
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
export class AssetPackDb extends AbstractModel<AssetPack, AssetPackModel> {
  public constructor() {
    super(
      {
        title: { type: String },
        tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
        description: { type: String, default: "" },
        assets: [{ type: ObjectId, ref: "assets" }],
        createdBy: { type: Schema.Types.ObjectId, ref: "users" },
        privacy: { type: String, enum: ["PRIVATE", "PUBLIC"], default: "PRIVATE" },
        roles: [{ type: Schema.Types.ObjectId, ref: "roles" }],
        customPermissionGroups: [{ type: Schema.Types.ObjectId, ref: "permissionGroups" }],
      },
      "assetPacks"
    );
  }
}
