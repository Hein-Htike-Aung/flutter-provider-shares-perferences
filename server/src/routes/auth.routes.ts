import { createError } from './../util/createError';
import bcryptjs from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { isAuthenticated } from "./../middlewares/isAuthencated";

const router = express.Router();

router.post("/signup", async (req, res, next) => {
  try {
    const { name, email, password, type } = req.body;

    const hashedPassword = await bcryptjs.hash(
      password,
      bcryptjs.genSaltSync(+process.env.SALT!)
    );

    let user = new User({
      name,
      email,
      type,
      password: hashedPassword,
    });

    user = await user.save();

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

router.post("/signin", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "Invalid Credentails" });

    const isMatched = await bcryptjs.compare(password, user.password);

    if (!isMatched)
      return res.status(404).json({ message: "Invalid Credentials" });

    const accessToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY!);

    res.json({ accessToken, ...user._doc });
  } catch (error: any) {
    next(error);
  }
});

router.post('/isTokenValid', async (req, res, next) => {
  try {
    const accessToken = req.header('Authorization').split(' ')[1];
    
    if(!accessToken) return next(createError(404, 'Token is empty'));

    const decodedToken: any = jwt.verify(accessToken, process.env.SECRET_KEY!);

    if (!decodedToken)
      return res.status(401).json({ message: "Token is invalid" });

    const user = await User.findById(decodedToken.id);

    if(!user) return next(createError(404, 'User not found'));

    res.status(200).json(true);

  } catch (error) {
    next(error);
  }
})

router.get("/current-user", isAuthenticated, async (req: any, res) => {
  const user = await User.findById(req.userId);

  if (!user) return res.status(404).json({ message: "User Not found" });

  res.status(200).json({ ...user._doc, accessToken: req.accessToken });
});

export default router;
