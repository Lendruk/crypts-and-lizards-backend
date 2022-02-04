import { model, Schema } from "mongoose";
import AssetPack from "./AssetPack";
import Tag from "./Tag";

interface Campaign {
  title: string;
  description: string;
  tags: Tag[];
  assetPacks: AssetPack[];
  forkedFrom: Campaign;
}

const CampaignSchema = new Schema<Campaign>({
  title: { type: String },
  description: { type: String },
  forkedFrom: { type: Schema.Types.ObjectId, ref: "Campaign" },
  assetPacks: [{ type: Schema.Types.ObjectId, ref: "AssetPack" }],
  tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
});

const Campaign = model<Campaign>("Campaign", CampaignSchema);
export default Campaign;
