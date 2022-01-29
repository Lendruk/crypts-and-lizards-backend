import { model, Schema } from "mongoose";
import { Vector2 } from "../types/Vector2";
import { ObjectId } from "../utils/ObjectId";
import Tag from "./Tag";
import User from "./User";

type MapObjectType = "PROP";

/**
 * Interface for a map template do not confuse with active game maps
 */
interface GameMap {
  title: string;
  description: string;
  tags: Tag[];
  mapLayers: MapLayer[];
  createdBy: User;
}

interface MapObject {
  type: MapObjectType;
  position: Vector2;
  objectId: ObjectId;
}

interface MapLayer {
  name: string;
  position: number;
  mapObjects: MapObject[];
  visibleTo: User[];
}

const GameMapSchema = new Schema<GameMap>({
  title: { type: String },
  description: { type: String },
  tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
  createdBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  assetPacks: [{ type: Schema.Types.ObjectId, ref: "AssetPack" }],
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
        },
      ],
      visibleTo: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
  ],
});

const GameMap = model<GameMap>("GameMap", GameMapSchema);
export default GameMap;
