import { Document, Schema } from "mongoose";
import AbstractModel from "../types/AbstractModel";
import AssetPack from "./AssetPack";
import Tag from "./Tag";

export interface Campaign {
  title: string;
  description: string;
  tags: Tag[];
  assetPacks: AssetPack[];
  forkedFrom: Campaign;
}

interface CampaignModel extends Campaign, Document {}
export class CampaignDb extends AbstractModel<Campaign, CampaignModel> {
  public constructor() {
    super(
      {
        title: { type: String },
        description: { type: String },
        forkedFrom: { type: Schema.Types.ObjectId, ref: "Campaign" },
        assetPacks: [{ type: Schema.Types.ObjectId, ref: "AssetPack" }],
        tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
      },
      "campaigns"
    );
  }
}
