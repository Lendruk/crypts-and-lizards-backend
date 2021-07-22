import { model, Schema, Types } from "mongoose";
import Category from "./Category";
import Currency from "./Currency";

interface Item {
  name: string;
  weight: number;
  value: number;
  currency: Currency;
  description: string;
  createdBy: Types.ObjectId;
  category: Category;
}

const ItemSchema = new Schema<Item>({
  name: { type: String },
  weight: { type: Number, default: 0 },
  value: { type: Number, default: 0 },
  currency: { type: Schema.Types.ObjectId, ref: 'Currency', default: null },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  category: { type: Schema.Types.ObjectId, ref: 'Category' }
});

const Item = model<Item>('Item', ItemSchema);
export default Item;