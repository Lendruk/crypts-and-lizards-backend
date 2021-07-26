import { model, Schema } from "mongoose";

interface Permission {
  name: string;
}

const PermissionSchema = new Schema<Permission>(
  {
    name: { type: String },
  },
  { timestamps: { createdAt: "_created" } }
);

const Permission = model<Permission>("Permission", PermissionSchema);
export default Permission;
