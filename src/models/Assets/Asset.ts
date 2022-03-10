import { injectable } from "inversify";
import { Document } from "mongoose";
import AbstractModel from "../../types/AbstractModel";

type AssetField = {
  field: string;
  value: string;
};

export interface Asset {
  id?: any;
  fields: AssetField[];
}

interface AssetModel extends Asset, Document {}
@injectable()
export class AssetCollection extends AbstractModel<Asset, AssetModel> {
  public constructor() {
    super({
      fields: [{ value: { type: String }, field: { type: String } }],
    });
  }
}
