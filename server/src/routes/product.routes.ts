import { RatingDocument } from "./../models/rating";
import { createError } from "./../util/createError";
import { isAuthenticated } from "./../middlewares/isAuthencated";
import express from "express";
import { isAdmin } from "../middlewares/isAdmin";
import Product from "../models/product";

const router = express.Router();

router.post("/", isAdmin, async (req, res, next) => {
  try {
    const { name, description, images, quantity, price, category } = req.body;

    let product = new Product({
      name,
      description,
      images,
      quantity,
      price,
      category,
    });

    product = await product.save();

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
});

router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const condition: Record<string, any> = {};
    const category = req.query.category;
    const name = req.query.name;

    if (category) {
      condition["category"] = category;
    }

    if (name) {
      condition["name"] = { $regex: new RegExp(name as string), $options: "i" };
    }

    const products = await Product.find(condition);
    res.json(products);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", isAdmin, async (req, res, next) => {
  try {
    const id = req.params.id;
    let product = await Product.findByIdAndDelete(id);

    res.status(202).json(product);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/rate-product/:productId",
  isAuthenticated,
  async (req: any, res, next) => {
    try {
      const productId = req.params.productId;
      const currentUserId = req.userId;

      let product = await Product.findById(productId);

      if (!product) return next(createError(404, "product not found"));

      // remove old rating
      product.ratings = product.ratings.filter(
        (r) => r.userId != currentUserId
      );

      // add new rating
      product.ratings.push({
        userId: currentUserId,
        rating: req.body.rating,
      } as RatingDocument);

      product = await product.save();
      res.status(202).json(product);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/deal-of-day", isAuthenticated, async (req, res, next) => {
  try {
    let products = await Product.find();

    products = products.sort((a, b) => {
      const aSum = a.ratings.reduce((acc, r) => acc + r.rating, 0);
      const bSum = b.ratings.reduce((acc, r) => acc + r.rating, 0);

      return aSum < bSum ? 1 : -1;
    });

    res.json(products[0]);
  } catch (error) {
    next(error);
  }
});

export default router;
