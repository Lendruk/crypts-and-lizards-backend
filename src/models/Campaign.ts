import { Document, Schema } from "mongoose";
import AbstractModel from "../types/AbstractModel";
import { AssetPack } from "./Assets/AssetPack";
import Tag from "./Tag";

export interface Campaign {
  id?: any;
  title: string;
  description: string;
  tags: Tag[];
  assetPacks: AssetPack[];
  forkedFrom: Campaign;
  createdBy: string;
  roles: string[];
}

interface CampaignModel extends Campaign, Document {}
export class CampaignDb extends AbstractModel<Campaign, CampaignModel> {
  public constructor() {
    super(
      {
        title: { type: String },
        description: { type: String },
        forkedFrom: { type: Schema.Types.ObjectId, ref: "campaigns" },
        assetPacks: [{ type: Schema.Types.ObjectId, ref: "assetPacks" }],
        tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
        createdBy: { type: Schema.Types.ObjectId, ref: "users" },
        roles: [{ type: Schema.Types.ObjectId, ref: "roles" }],
      },
      "campaigns"
    );
  }
}
