import { Schema, Document } from 'mongoose';

export const OrderSchema = new Schema(
  {
    date: { type: Date, default: Date.now },
    productIds: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    total: { type: Number, required: true },
  },
  { timestamps: true },
);

export interface Order extends Document {
  id: string;
  date: Date;
  productIds: string[];
  total: number;
}
