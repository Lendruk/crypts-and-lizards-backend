import { model, Schema } from "mongoose";

interface Category {
  name: string;
  subCategories: Category[];
  parent?: Category;
}

const CategorySchema = new Schema<Category>(
  {
    name: { type: String },
    subCategories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    parent: { type: Schema.Types.ObjectId, ref: "Category", default: null },
  },
  { timestamps: { createdAt: "_created", updatedAt: "_modified" } }
);

const Category = model<Category>("Category", CategorySchema);
export default Category;
