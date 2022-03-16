import { Document, Schema } from "mongoose";
import AbstractModel from "../types/AbstractModel";
import { Tag, TagCollection } from "./Tag";

export interface Project {
  id?: any;
  title: string;
  description: string;
  tags: Tag[];
}

interface ProjectModel extends Project, Document {}
export class ProjectCollection extends AbstractModel<Project, ProjectModel> {
  public constructor() {
    super({
      title: { type: String },
      description: { type: String },
      tags: [{ type: Schema.Types.ObjectId, ref: TagCollection }],
    });
  }
}
