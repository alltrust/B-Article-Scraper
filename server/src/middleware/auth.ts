import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { UnauthErrorRequest } from "../errors";

interface UserJWTPayload extends JwtPayload {
  userId: mongoose.Types.ObjectId;
}

export interface UserRequest extends Request {
  user?: { userId: mongoose.Types.ObjectId };
}

const authMiddleWare = (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeaders = req.headers.authorization;
  if (!authHeaders || !authHeaders.startsWith("Bearer")) {
    throw new UnauthErrorRequest("You do not have access.")
  }

  const authToken = authHeaders!.split(" ")[1];
  try {
    if (process.env.JWT_SECRET) {
      const payload = jwt.verify(
        authToken,
        process.env.JWT_SECRET
      ) as UserJWTPayload;
      const { userId } = payload;
        req.user = { userId: userId };
    }
    next();
  } catch (err) {
    //send unauth error here as well
    next(err);
  }
};

export default authMiddleWare;
