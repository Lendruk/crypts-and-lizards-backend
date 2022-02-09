import { injectable } from "inversify";
import { Document, Schema } from "mongoose";
import AbstractModel from "../types/AbstractModel";
import { Permission } from "./Permission";

export interface Role {
  name: string;
  permissions: Permission[];
}

interface RoleModel extends Role, Document {}
@injectable()
export class RoleDb extends AbstractModel<Role, RoleModel> {
  public constructor() {
    super(
      {
        name: { type: String },
        permissions: [{ type: Schema.Types.ObjectId, ref: "Permission" }],
      },
      "roles"
    );
  }
}
