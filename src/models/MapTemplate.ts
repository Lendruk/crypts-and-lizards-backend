import { Document, Schema } from "mongoose";
import AbstractModel from "../types/AbstractModel";
import { Vector2 } from "../types/Vector2";
import { ObjectId } from "../utils/ObjectId";
import { AssetPack, AssetPackCollection } from "./Assets/AssetPack";
import { Tag, TagCollection } from "./Tag";
import { User, UserCollection } from "./User";

type MapObjectType = "PROP" | "TEXTURE";

/**
 * Interface for a map template do not confuse with active game maps
 */
export interface MapTemplate {
  title: string;
  description: string;
  tags: Tag[];
  mapLayers: MapLayer[];
  createdBy: User | ObjectId;
  assetPacks: AssetPack[] | ObjectId[];
}

interface MapObject {
  type: MapObjectType;
  position: Vector2;
  id: ObjectId;
}

interface MapLayer {
  name: string;
  position: number;
  mapObjects: MapObject[];
}

interface MapTemplateModel extends MapTemplate, Document {}
export class MapTemplateCollection extends AbstractModel<MapTemplate, MapTemplateModel> {
  public constructor() {
    super({
      title: { type: String },
      description: { type: String },
      tags: [{ type: Schema.Types.ObjectId, ref: TagCollection }],
      createdBy: [{ type: Schema.Types.ObjectId, ref: UserCollection }],
      assetPacks: [{ type: Schema.Types.ObjectId, ref: AssetPackCollection }],
      mapLayers: [
        {
          name: { type: String },
          position: { type: Number },
          mapObjects: [
            {
              position: {
                x: { type: Number },
                y: { type: Number },
              },
              type: { type: String, enum: ["PROP", "TEXTURE"] },
              id: { type: ObjectId },
            },
          ],
        },
      ],
    });
  }
}
