import { body } from "express-validator";

const validateLogin = [
  body("password", "atleast 4 characters").isLength({ min: 4 }),
];

export { validateLogin };
