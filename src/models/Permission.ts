import { Document, Schema } from "mongoose";
import AbstractModel from "../types/AbstractModel";
import { Model } from "../types/Model";
import { ObjectId } from "../utils/ObjectId";

export interface Permission extends Model {
  name: string;
  shortName: string;
  description: string;
}

interface PermissionModel extends Permission, Document {}
export class PermissionCollection extends AbstractModel<Permission, PermissionModel> {
  public constructor() {
    super({
      name: { type: String },
      description: { type: String },
      shortName: { type: String },
    });
  }
}

export interface PermissionGroup extends Model {
  name: string;
  shortName: string;
  description: string;
  permissions: Permission[] | ObjectId[];
  global: boolean;
}
interface PermissionGroupModel extends PermissionGroup, Document {}
export class PermissionGroupCollection extends AbstractModel<PermissionGroup, PermissionGroupModel> {
  public constructor() {
    super({
      name: { type: String },
      description: { type: String },
      shortName: { type: String },
      global: { type: Boolean, default: false },
      permissions: [{ type: Schema.Types.ObjectId, ref: PermissionCollection }],
    });
  }
}
