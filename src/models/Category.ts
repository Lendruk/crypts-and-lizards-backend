import { model, Schema } from "mongoose";

interface Category {
  name: string;
  subCategories: Category[];
}

const CategorySchema = new Schema<Category>({
  name: { type: String },
  subCategories: [{ type: Schema.Types.ObjectId, ref: 'Category' }]
});

const Category = model<Category>('Category', CategorySchema);
export default Category;