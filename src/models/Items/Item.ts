import { model, Schema } from "mongoose";
import { ObjectId } from "../../utils/ObjectId";
import { Category } from "../Category";
import { User } from "../User";

interface Item<T> {
  name: string;
  weight: number;
  value: number;
  description: string;
  category: Category;
  properties: T;
  createdBy: User | ObjectId;
}

const ItemSchema = new Schema<Item<any>>({
  name: { type: String },
  weight: { type: Number, default: 0 },
  value: { type: Number, default: 0 },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  category: { type: Schema.Types.ObjectId, ref: "Category" },
});

const Item = model<Item<any>>("Item", ItemSchema);
export default Item;
