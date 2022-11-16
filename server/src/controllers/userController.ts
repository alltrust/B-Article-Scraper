import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import User from "../models/User";
import { IUser } from "../models/User";

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password }: IUser = req.body;
  try {
    if (!username || !email || !password) {
      const error = new Error("Please dont leave any fields empty");
      next(error);
    }
    const userEmailExists = await User.findOne({ email: email });
    if (userEmailExists) {
      const error = new Error(
        "This user already exists, please create different email"
      );
      next(error);
    }
    const user = await User.create(req.body);

    res
      .status(StatusCodes.CREATED)
      .json({
        username: user.username,
        email: user.email,
        password: user.password,
      });
  } catch (err) {
    next(err);
  }
};
const loginUser = (req: Request, res: Response) => {
  res.send("hello from updateUser");
};
const updateUser = (req: Request, res: Response) => {
  res.send("hello from updateUser");
};

export { registerUser, loginUser, updateUser };
