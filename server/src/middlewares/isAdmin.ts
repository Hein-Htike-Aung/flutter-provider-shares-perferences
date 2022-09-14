import { isAuthenticated } from "./isAuthencated";
import { Request, Response, NextFunction } from "express";
import User from "../models/user";

export const isAdmin = (req: any, res: Response, next: NextFunction) => {
  isAuthenticated(req, res, async () => {
    const userId = req.userId;

    const user = await User.findById(userId);

    if (user) {
      if (user.type === "user" || user.type == "seller")
        return res.status(401).json({ message: "You are not an admin" });
    }else return res.status(404).json({ message: "User not found" });

    next();
  });
};
