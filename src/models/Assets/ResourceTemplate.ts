import { injectable } from "inversify";
import { Document } from "mongoose";
import AbstractModel from "../../types/AbstractModel";
import { ObjectId } from "../../utils/ObjectId";
import { User, UserCollection } from "../User";

export type ResourceField = {
  name: string;
  valueType: string;
};

export interface ResourceTemplate {
  name: string;
  description: string;
  fields: ResourceField[];
  createdBy: User;
  assetPacks: string[];
  id?: any;
}

interface ResourceTemplateModel extends ResourceTemplate, Document {}

@injectable()
export class ResourceTemplateCollection extends AbstractModel<ResourceTemplate, ResourceTemplateModel> {
  public constructor() {
    super({
      name: { type: String },
      description: { type: String },
      createdBy: { type: ObjectId, ref: UserCollection },
      assetPacks: [{ type: ObjectId, ref: "assetPacks" }],
      fields: [
        {
          name: { type: String },
          valueType: { type: String },
        },
      ],
    });
  }
}
