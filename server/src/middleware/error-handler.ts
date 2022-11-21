import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { MongooseError } from "mongoose";

interface DefaultError {
  message: string;
  status: StatusCodes;
}

interface DefaultErrorResponse extends DefaultError, ErrorRequestHandler {
  keyValue: {};
  errors: Error | MongooseError;
  code: number;
  name: string;
}
const errorHandlerMiddleware = (
  err: DefaultErrorResponse,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { message, status, name, code } = err;

  const defaultError: DefaultError = {
    message: message || "Something went wrong, please try again in a moment",
    status: status || StatusCodes.INTERNAL_SERVER_ERROR,
  };

  if (name === "ValidationError") {
    defaultError.message = Object.values(err.errors)
      .map((err: Error) => {
        return err.message;
      })
      .join(", ");
    defaultError.status = StatusCodes.BAD_REQUEST;
  }

  if (code && code === 11000) {
    defaultError.message = `${Object.keys(
      err.keyValue
    )} field has to be unique`;
  }
 

  res.status(defaultError.status).json({ message: defaultError.message });
};

export default errorHandlerMiddleware;
