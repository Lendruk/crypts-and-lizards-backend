import { model, Schema } from "mongoose";

interface Versioning {
  defaultItemsVer: number;
}

const VersioningSchema = new Schema<Versioning>({
  defaultItemsVer: { type: Number }
});

const Versioning = model<Versioning>('Versioning', VersioningSchema);
export default Versioning;