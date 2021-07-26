import { model, Schema } from "mongoose";
import Permission from "./Permission";

interface Role {
  name: string;
  permissions: Permission[];
}

const RoleSchema = new Schema<Role>({
  name: { type: String },
  permissions: [{ type: Schema.Types.ObjectId, ref: "Permission" }],
});

const Role = model<Role>("Role", RoleSchema);
export default Role;
