import express from "express";
import Order from "../models/order";
import Product from "../models/product";
import User from "../models/user";
import { isAdmin } from "./../middlewares/isAdmin";
import { isAuthenticated } from "./../middlewares/isAuthencated";
import { ProductDocument } from "./../models/product";
import { createError } from "./../util/createError";

const router = express.Router();

router.post("/", isAuthenticated, async (req: any, res, next) => {
  try {
    const {
      cart,
      totalPrice,
      address,
    }: {
      cart: { productId: string; quantity: number }[];
      totalPrice: number;
      address: string;
    } = req.body;

    let targetProducts: { product: ProductDocument; quantity: number }[] = [];

    cart.forEach(async (c) => {
      const storedProduct = await Product.findById(c.productId);
      // Check Stock Quantity
      if (!storedProduct) return next(createError(404, "Product not found"));

      if (storedProduct.quantity > c.quantity) {
        // reduce stock quantity
        storedProduct.quantity -= c.quantity;
        targetProducts.push({ product: storedProduct, quantity: c.quantity });
        await storedProduct.save();
      } else {
        return next(
          createError(400, `${storedProduct?.name} is out of stock!`)
        );
      }
    });

    // Clear user's cart
    let currentUser = await User.findById(req.userId);
    if (!currentUser) return next(createError(404, "User Not found"));
    currentUser.cart = [];
    await currentUser.save();

    // save order
    let order = new Order({
      products: targetProducts,
      totalPrice,
      address,
      userId: req.userId,
      orderAt: new Date().getTime(),
    });

    order = await order.save();

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
});

router.post("/change-order-status/:id", isAdmin, async (req, res, next) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    );

    res.status(202).json(updatedOrder);
  } catch (error) {
    next(error);
  }
});

router.get("/", isAdmin, async (req, res, next) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

router.get("/analytics", isAdmin, async (req, res, next) => {
  try {
    const orders = await Order.find();

    let totalEarning = 0;
    orders.forEach((o) => {
      o.products.forEach((p) => {
        totalEarning += p.product.price * p.quantity;
      });
    });

    const mobileEarnings = await findTotalEarningByCategoy("Mobiles");
    const essentialsEarnings = await findTotalEarningByCategoy("Essentials");
    const applianceEarnings = await findTotalEarningByCategoy("Appliances");
    const booksEarnings = await findTotalEarningByCategoy("Books");
    const fashionEarnings = await findTotalEarningByCategoy("Fashion");

    res.json({
      totalEarning,
      mobileEarnings,
      essentialsEarnings,
      applianceEarnings,
      booksEarnings,
      fashionEarnings,
    });
  } catch (error) {
    next(error);
  }
});

const findTotalEarningByCategoy = async (category: string) => {
  let earning = 0;

  const ordersByCategory = await Order.find({
    "products.product": { category },
  });

  ordersByCategory.forEach((o) => {
    o.products.forEach((op) => {
      earning += op.product.price * op.quantity;
      // if (op.product.category === category) {
      // }
    });
  });

  return earning;
};

router.get("/user/orders", isAuthenticated, async (req: any, res, next) => {
  try {
    const orders = await Order.find({ userId: req.userId });

    res.json(orders);
  } catch (error) {
    next(error);
  }
});

export default router;
