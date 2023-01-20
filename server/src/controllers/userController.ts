import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { BadErrorRequest } from "../errors";
import { UserRequest } from "../middleware/auth";
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
      throw new BadErrorRequest(" Please don't leave any fields empty");
    }

    const existingUser = await User.findOne({email:email});
    if(existingUser){
      throw new BadErrorRequest("This user already exists, please login")
    }
    const user = await User.create(req.body);
    const token = user.createJWT();

    res.status(StatusCodes.CREATED).json({
      user: {
        email: user.email,
        username: user.username,
        id: user._id,
      },
      token: token,
    });
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password }: IUser = req.body;
  let selectedCredential: "username" | "email";
  let credential: string;
  try {
    if (!username && !email) {
      throw new BadErrorRequest("Please don't leave any fields empty");
    }
    if (username) {
      credential = username;
      selectedCredential = "username";
    } else {
      credential = email;
      selectedCredential = "email";
    }

    const user = await User.findOne({
      [`${selectedCredential}`]: credential,
    }).select("+password");
    if (!user) {
      throw new BadErrorRequest(
        `You have not regisetered this ${selectedCredential} yet`
      );
    }
    const passwordIsMatch = await user?.comparePasswords(password);
    if (!passwordIsMatch) {
      throw new BadErrorRequest(
        `The password does not match this ${selectedCredential}`
      );
    }
    if (user && passwordIsMatch) {
      const token = user?.createJWT();
      res.status(StatusCodes.OK).json({
        user: {
          username: user.username,
          email: user.email,
          id: user._id,
        },
        token: token,
      });
    }
  } catch (err) {
    next(err);
  }
};

const updateUser = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const { email, username }: IUser = req.body;

  if (!email || !username) {
    throw new BadErrorRequest("Please dont leave fields empty");
  }
  try {
    const user = await User.findOne({ _id: req.user?.userId });
    if (!user) {
      throw new Error("This user does not exist in the database");
    }

    user.email = email;
    user.username = username;

    const token = user.createJWT();
    user.save();

    res.status(StatusCodes.OK).json({ user, token });
  } catch (err) {
    next(err);
  }
};

export { registerUser, loginUser, updateUser };
