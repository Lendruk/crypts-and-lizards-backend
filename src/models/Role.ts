import { injectable } from "inversify";
import { Document, Schema } from "mongoose";
import AbstractModel from "../types/AbstractModel";
import { ObjectId } from "../utils/ObjectId";
import { Permission, PermissionGroup } from "./Permission";

export interface Role {
  id?: any;
  name: string;
  groups: PermissionGroup[] | ObjectId[];
  permissions: Permission[] | ObjectId[];
}

interface RoleModel extends Role, Document {}
@injectable()
export class RoleDb extends AbstractModel<Role, RoleModel> {
  public constructor() {
    super(
      {
        name: { type: String },
        groups: [{ type: Schema.Types.ObjectId, ref: "permissionGroups" }],
        permissions: [{ type: Schema.Types.ObjectId, ref: "permissions" }],
      },
      "roles"
    );
  }
}
