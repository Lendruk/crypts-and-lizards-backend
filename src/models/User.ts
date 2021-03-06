import { injectable } from "inversify";
import { Document, Schema, Types } from "mongoose";
import AbstractModel from "../types/AbstractModel";
import { ObjectId } from "../utils/ObjectId";
import { Role, RoleCollection } from "./Role";

type UserRole = {
  role: Role | ObjectId;
  modelName: string;
  entity: ObjectId;
};

export interface User {
  username: string;
  email: string;
  password: string;
  usedAssets: UsedAssets;
  roles: UserRole[];
  id?: any;
}

export interface UserModel extends User, Document {}

interface UsedAssets {
  assetPacks: Types.ObjectId[];
}

@injectable()
export class UserCollection extends AbstractModel<User, UserModel> {
  public constructor() {
    super(
      {
        username: { type: String },
        email: { type: String },
        password: { type: String },
        roles: [
          {
            role: { type: Schema.Types.ObjectId, ref: RoleCollection },
            modelName: { type: Schema.Types.String },
            entity: { type: Schema.Types.ObjectId },
          },
        ],
      },
      { timestamps: { createdAt: "_created" } }
    );
  }
}
