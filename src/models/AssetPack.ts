import { injectable } from "inversify";
import { Document, model, Schema } from "mongoose";
import AbstractModel from "../types/AbstractModel";
import Category from "./Category";
import Currency from "./Items/Currency";
import Item from "./Items/Item";
import Tag from "./Tag";
import { User } from "./User";

type AssetPackPrivacy = "PUBLIC" | "PRIVATE" | "TRUSTED";

interface Asset {
  items: Item<any>[];
  currencies: Currency[];
  categories: Category[];
}

export interface AssetPack {
  title: string;
  description: string;
  assets: Asset;
  privacy: AssetPackPrivacy;
  createdBy: User;
  tags: Tag[];
}

const AssetSchema = new Schema<Asset>({
  items: [{ type: Schema.Types.ObjectId, ref: "Item" }],
  currencies: [{ type: Schema.Types.ObjectId, ref: "Currency" }],
  categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
});

interface AssetPackModel extends AssetPack, Document {}
@injectable()
export class AssetPackDb extends AbstractModel<AssetPack, AssetPackModel> {
  public constructor() {
    super(
      {
        title: { type: String },
        tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
        description: { type: String, default: "" },
        assets: { type: AssetSchema },
        createdBy: { type: Schema.Types.ObjectId, ref: "User" },
        privacy: { type: String, enum: ["PRIVATE", "PUBLIC", "TRUSTED"], default: "PRIVATE" },
      },
      "assetPacks"
    );
  }
}
