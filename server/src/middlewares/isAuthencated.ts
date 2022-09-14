import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const isAuthenticated = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.header("Authorization").split(' ')[1];

    if (!accessToken)
      return res.status(401).json({ message: "No Auth Token, access denied" });

    const decodedToken: any = jwt.verify(accessToken, process.env.SECRET_KEY!);

    if (!decodedToken)
      return res.status(401).json({ message: "Token is invalid" });

    req.userId = decodedToken.id;
    req.accessToken = accessToken;

    next();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
