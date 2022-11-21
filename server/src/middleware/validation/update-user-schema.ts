import { body } from "express-validator";

const validateUpdateUser = [
  body("email", "an appropriate email").isEmail(),
  body("username", "between 2 and 20 characters long").isLength({
    min: 2,
    max: 20,
  }),
];

export { validateUpdateUser };
