import { Document, Schema } from "mongoose";
import AbstractModel from "../types/AbstractModel";
import { ObjectId } from "../utils/ObjectId";

export interface Category {
  name: string;
  subCategories: Category[];
  parent?: Category | ObjectId;
}
interface CategoryModel extends Category, Document {}
export class CategoryCollection extends AbstractModel<Category, CategoryModel> {
  public constructor() {
    super({
      name: { type: String },
      subCategories: [{ type: Schema.Types.ObjectId, ref: CategoryCollection }],
      parent: { type: Schema.Types.ObjectId, ref: CategoryCollection },
    });
  }
}
