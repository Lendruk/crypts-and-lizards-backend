import { model, Schema } from "mongoose";
import AssetPack from "./AssetPack";

interface Campaign {
  title: string;
  description: string;
  assetPacks: AssetPack[];
}

const CampaignSchema = new Schema<Campaign>({
  title: { type: String },
  description: { type: String },
  forkedFrom: { type: Schema.Types.ObjectId, ref: "Campaign" },
  assetPacks: [{ type: Schema.Types.ObjectId, ref: "AssetPack" }],
});

const Campaign = model<Campaign>("Campaign", CampaignSchema);
export default Campaign;
