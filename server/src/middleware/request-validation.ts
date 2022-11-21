import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { BadErrorRequest } from "../errors";

const requestValidation = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const validationErrors = errors.array();
    const { param, msg, value } = validationErrors[0];
    throw new BadErrorRequest(
      `"${param}" must be ${msg}. "${value}" is invalid `
    );
  }
  next();
};

export default requestValidation;
