import { Schema, Document } from 'mongoose';

export const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    categoryIds: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    imageUrl: { type: String, required: true },
  },
  { timestamps: true },
);

export interface Product extends Document {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryIds: string[];
  imageUrl: string;
}
