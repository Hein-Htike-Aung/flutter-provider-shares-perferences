import mongoose from "mongoose";
import Rating, { RatingDocument } from "./rating";

export interface ProductDocument extends mongoose.Document {
  name: string;
  description: string;
  images: string[];
  quantity: number;
  price: number;
  category: string;
  ratings: RatingDocument[];
  _doc: any;
}

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  images: [
    {
      type: String,
      required: true,
    },
  ],
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    requried: true,
  },
  category: {
    type: String,
    required: true,
  },
  ratings: [Rating.schema],
});

const Product = mongoose.model<ProductDocument>("Product", productSchema);
export default Product;
