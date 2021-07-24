import { model, Schema } from "mongoose";
import { ObjectId } from "../utils/ObjectId";
import User from "./User";

type Device = 'WEB' | 'MOBILE';

export interface Token {
  _id: ObjectId;
  user: User;
  token: string;
  device: Device;
}

const TokenSchema = new Schema<Token>({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  token: { type: String, default: null, unique: true },
  device: { type: String, }
},{ timestamps: { createdAt: '_created' } });

export default model<Token>('Token', TokenSchema);