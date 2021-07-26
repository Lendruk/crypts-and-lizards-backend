import { model, Schema, Types } from "mongoose";
import Category from "../Category";
import Currency from "./Currency";

export interface Weapon {
  damage1: string;
  damage2: string;
  damageType: string;
  properties: string[];
}

interface Item<T> {
  name: string;
  weight: number;
  value: number;
  currency: Currency;
  description: string;
  createdBy: Types.ObjectId;
  category: Category;
  properties: T;
}

const ItemSchema = new Schema<Item<any>>({
  name: { type: String },
  weight: { type: Number, default: 0 },
  value: { type: Number, default: 0 },
  currency: { type: Schema.Types.ObjectId, ref: "Currency", default: null },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  category: { type: Schema.Types.ObjectId, ref: "Category" },
});

const Item = model<Item<any>>("Item", ItemSchema);
export default Item;
