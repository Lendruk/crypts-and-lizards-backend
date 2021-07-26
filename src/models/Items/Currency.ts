import { model, Schema } from "mongoose";

interface Currency {
  name: string;
  shortName: string;
  weight: number;
  description: string;
}

const CurrencySchema = new Schema<Currency>({
  name: { type: String },
  shortName: { type: String },
  weight: { type: Number },
  description: { type: String },
});

const Currency = model<Currency>("Currency", CurrencySchema);
export default Currency;
