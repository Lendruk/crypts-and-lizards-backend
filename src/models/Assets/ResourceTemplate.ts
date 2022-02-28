import { injectable } from "inversify";
import { Document } from "mongoose";
import AbstractModel from "../../types/AbstractModel";
import { ObjectId } from "../../utils/ObjectId";
import { User } from "../User";

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
export class ResourceTemplateDb extends AbstractModel<ResourceTemplate, ResourceTemplateModel> {
  public constructor() {
    super(
      {
        name: { type: String },
        description: { type: String },
        createdBy: { type: ObjectId, ref: "users" },
        assetPacks: [{ type: ObjectId, ref: "assetPacks" }],
        fields: [
          {
            name: { type: String },
            valueType: { type: String },
          },
        ],
      },
      "resourceTemplates"
    );
  }
}
