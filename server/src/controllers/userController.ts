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
    //check for authorization header to ensure that this user it legitimate via JSON webToken
    //store this in  a middleware so that the authorization header is sent on every request
    //send the token via json as well as the rest of the user
    //store the user in req.user .userId so that you can access it server-side and and then save the user

    //in the model use instance methods to create a new JWT token whenever the user updates their "profile" 
    //... so that is updates the jwt expiration 
    //... also create a JWT with every login that is valid
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
