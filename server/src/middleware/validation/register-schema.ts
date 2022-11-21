import { body, check } from "express-validator";

const validateRegister = [
  body("username", "between 2 and 20 characters long").isLength({
    min: 2,
    max: 20,
  }),
  body("email", "a proper email").isEmail(),
  body("password", "atleast 4 characters").isLength({ min: 4 }),
];

export { validateRegister };
