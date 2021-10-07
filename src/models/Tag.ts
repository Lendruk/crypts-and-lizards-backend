import { model, Schema } from "mongoose";

interface Tag {
  name: string;
  _id: string;
}

const TagSchema = new Schema<Tag>({
  name: { type: String },
});

const Tag = model<Tag>("Tag", TagSchema);
export default Tag;
