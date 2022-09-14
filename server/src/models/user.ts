import mongoose from "mongoose";
import Product, { ProductDocument } from "./product";

export interface UserDocument extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  address: string;
  type: string;
  cart: { product: ProductDocument; quantity: number }[];
  _doc: any;
}

const userSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    trim: true,
  },
  email: {
    required: true,
    type: String,
    trim: true,
    unique: true,
    validate: {
      validator: (value: string) => {
        const regex =
          /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return value.match(regex);
      },
    },
  },
  password: {
    required: true,
    type: String,
  },
  address: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "user",
  },
  cart: [
    {
      product: Product.schema,
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

const User = mongoose.model<UserDocument>("User", userSchema);
export default User;
