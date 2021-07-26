import { model, Schema } from "mongoose";

interface Campaign {
  title: string;
  description: string;
  assets: {
    items: Schema.Types.ObjectId[];
  };
}

const CampaignSchema = new Schema<Campaign>({
  title: { type: String },
  description: { type: String },
  forkedFrom: { type: Schema.Types.ObjectId, ref: "Campaign" },
  assetPacks: [{ type: Schema.Types.ObjectId, ref: "AssetPack" }],
});

const Campaign = model<Campaign>("Campaign", CampaignSchema);
export default Campaign;
