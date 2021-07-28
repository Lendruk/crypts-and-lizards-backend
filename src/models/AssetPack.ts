import { model, Schema } from "mongoose";
import Category from "./Category";
import Currency from "./Items/Currency";
import Item from "./Items/Item";
import User from "./User";

type AssetPackPrivacy = "PUBLIC" | "PRIVATE" | "TRUSTED";

interface Asset {
  items: Item<any>[];
  currencies: Currency[];
  categories: Category[];
}

interface AssetPack {
  title: string;
  description: string;
  assets: Asset;
  privacy: AssetPackPrivacy;
  createdBy: User;
}

const AssetSchema = new Schema<Asset>({
  items: [{ type: Schema.Types.ObjectId, ref: "Item" }],
  currencies: [{ type: Schema.Types.ObjectId, ref: "Currency" }],
  categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
});

const AssetPackSchema = new Schema<AssetPack>(
  {
    title: { type: String },
    description: { type: String, default: "" },
    assets: { type: AssetSchema, default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    privacy: { type: String, enum: ["PRIVATE", "PUBLIC", "TRUSTED"], default: "PRIVATE" },
  },
  { timestamps: { createdAt: "_created", updatedAt: "_modified" } }
);

const AssetPack = model<AssetPack>("AssetPack", AssetPackSchema);
export default AssetPack;
