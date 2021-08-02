import { Vector2 } from "../types/Vector2";
import { ObjectId } from "../utils/ObjectId";
import User from "./User";

type MapObjectType = "PROP";

/**
 * Interface for a map template do not confuse with active game maps
 */
export interface GameMap {
  title: string;
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
