import { Document, Schema } from "mongoose";
import AbstractModel from "../types/AbstractModel";
import { Model } from "../types/Model";

export interface Permission extends Model {
  name: string;
  shortName: string;
  description: string;
}

interface PermissionModel extends Permission, Document {}
export class PermissionDb extends AbstractModel<Permission, PermissionModel> {
  public constructor() {
    super(
      {
        name: { type: String },
        description: { type: String },
        shortName: { type: String },
      },
      "permissions"
    );
  }
}

export interface PermissionGroup extends Model {
  name: string;
  shortName: string;
  description: string;
  permissions: Permission[];
  global: boolean;
}
interface PermissionGroupModel extends PermissionGroup, Document {}
export class PermissionGroupDb extends AbstractModel<PermissionGroup, PermissionGroupModel> {
  public constructor() {
    super(
      {
        name: { type: String },
        description: { type: String },
        shortName: { type: String },
        global: { type: Boolean, default: false },
        permissions: [{ type: Schema.Types.ObjectId, ref: "permissions" }],
      },
      "permissionGroups"
    );
  }
}
