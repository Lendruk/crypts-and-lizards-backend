import { Document } from "mongoose";
import AbstractModel from "../types/AbstractModel";

export interface Permission {
  name: string;
}

interface PermissionModel extends Permission, Document {}
export class PermissionDb extends AbstractModel<Permission, PermissionModel> {
  public constructor() {
    super(
      {
        name: { type: String },
      },
      "permissions"
    );
  }
}
