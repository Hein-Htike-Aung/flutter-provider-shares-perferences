import { UserDocument } from "./../models/user";
import { ProductDocument } from "./../models/product";
import { createError } from "./../util/createError";
import { isAuthenticated } from "./../middlewares/isAuthencated";
import express from "express";
import Product from "../models/product";
import User from "../models/user";
import { userInfo } from "os";

const router = express.Router();

router.patch("/", isAuthenticated, async (req: any, res, next) => {
  try {
    const currentUser = await User.findByIdAndUpdate(
      req.userId,
      { $set: req.body },
      { new: true }
    );

    res.status(201).json(currentUser);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/add-to-cart/:productId",
  isAuthenticated,
  async (req: any, res, next) => {
    try {
      const productId = req.params.productId;

      const product = await Product.findById(productId);
      let currentUser = await User.findById(req.userId);

      if (!currentUser) return next(createError(404, "User not found"));

      const foundProduct = currentUser.cart.find((c) => {
        return c.product._id.toString() === productId;
      });

      if (foundProduct) {
        foundProduct.quantity += 1;
      } else {
        currentUser.cart.push({
          product: product as ProductDocument,
          quantity: 1,
        });
      }

      currentUser = await currentUser.save();

      res.status(201).json(currentUser);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/remove-from-cart/:productId",
  isAuthenticated,
  async (req: any, res, next) => {
    try {
      const productId = req.params.productId;

      let currentUser = await User.findById(req.userId);

      if (!currentUser) return next(createError(404, "User not found"));

      currentUser.cart.forEach((c, index) => {
        if (c.product._id.toString() === productId) {
          if (c.quantity === 1) {
            currentUser?.cart.splice(index, 1);
          } else {
            currentUser!.cart[index].quantity -= 1;
          }
        }
      });

      currentUser = await currentUser.save();

      res.status(202).json(currentUser);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
