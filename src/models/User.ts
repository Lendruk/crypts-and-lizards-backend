import { model, Schema, Types } from "mongoose";

interface User {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  usedAssets: UsedAssets;
}

interface UsedAssets {
  assetPacks: Types.ObjectId[];
}

const UserSchema = new Schema<User>(
  {
    username: { type: String },
    email: { type: String },
    password: { type: String },
  },
  { timestamps: { createdAt: "_created", updatedAt: "_modified" } }
);

const User = model<User>("User", UserSchema);
export default User;
