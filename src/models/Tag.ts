import { Document } from "mongoose";
import AbstractModel from "../types/AbstractModel";

export interface Tag {
  name: string;
  id?: any;
}

interface TagModel extends Tag, Document {}
export class TagCollection extends AbstractModel<Tag, TagModel> {
  public constructor() {
    super({
      name: { type: String },
    });
  }
}
