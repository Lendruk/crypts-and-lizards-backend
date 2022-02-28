import { Request } from "express";
import { User } from "../models/User";

export interface ExpressRequest extends Request {
  user: User;
  accessToken?: string;
  currentPermissions: string[];
}
