import { injectable } from "inversify";
import { Document, Types } from "mongoose";
import AbstractModel from "../types/AbstractModel";

export interface User {
  username: string;
  email: string;
  password: string;
  usedAssets: UsedAssets;
  id?: any;
}

export interface UserModel extends User, Document {}

interface UsedAssets {
  assetPacks: Types.ObjectId[];
}

@injectable()
export class UserDb extends AbstractModel<User, UserModel> {
  public constructor() {
    super(
      {
        username: { type: String },
        email: { type: String },
        password: { type: String },
      },
      "users"
    );
  }
}
