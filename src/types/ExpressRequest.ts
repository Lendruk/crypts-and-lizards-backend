import { Request } from "express";
import { User } from "../models/User";
import { ExistingPermissions } from "./ExistingPermissions";

export interface ExpressRequest extends Request {
  user: User;
  accessToken?: string;
  currentPermissions: ExistingPermissions[];
}
