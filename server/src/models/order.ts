import mongoose from "mongoose";
import Product, { ProductDocument } from "./product";

export interface OrderDocument extends mongoose.Document {
  userId: string;
  address: string;
  products: { product: ProductDocument; quantity: number }[];
  totalPrice: number;
  orderAt: number;
  status: number;
  _doc: any;
}

const orderSchema = new mongoose.Schema({
  userId: {
    required: true,
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
  products: [
    {
      product: Product.schema,
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  orderAt: {
    type: Number,
    required: true,
  },
  status: {
    type: Number,
    default: 0,
  },
});

const Order = mongoose.model<OrderDocument>("Order", orderSchema);
export default Order;
