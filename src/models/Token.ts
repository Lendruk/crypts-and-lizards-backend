import { injectable } from "inversify";
import { Document, model, Schema } from "mongoose";
import AbstractModel from "../types/AbstractModel";
import { User, UserCollection } from "./User";

type Device = "WEB" | "MOBILE";

export interface Token {
  id?: any;
  user: User;
  token: string;
  device: Device;
}

export interface TokenModel extends Token, Document {}
@injectable()
export class TokenCollection extends AbstractModel<Token, TokenModel> {
  public constructor() {
    super(
      {
        user: { type: Schema.Types.ObjectId, ref: UserCollection },
        token: { type: String, default: "", unique: true },
        device: { type: String },
      },
      undefined,
      { fields: { createdAt: 1 }, options: { expireAfterSeconds: 3600 } }
    );
  }
}
