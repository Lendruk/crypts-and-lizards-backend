import { model, Schema } from "mongoose";

interface Campaign {
  title: string;
  description: string;
  assets: {
    items: Schema.Types.ObjectId[],
  }
}

const CampaignSchema = new Schema<Campaign>({
  title: { type: String },
  description: { type: String },
  assets: {
    items: [{ type: Schema.Types.ObjectId, ref: 'Item' }],
    spells: [{ type: Schema.Types.ObjectId, ref: 'Spell'}]
  },
});

const Campaign = model<Campaign>('Campaign', CampaignSchema);
export default Campaign;