import express from "express";
import {
  registerUser,
  loginUser,
  updateUser,
} from "../controllers/userController";
import {
  validateRegister,
  validateLogin,
  validateUpdateUser,
} from "../middleware/validation";
import isValid from "../middleware/request-validation";
import authMiddleWare from "../middleware/auth";
import rateLimiter from "express-rate-limit";

const apiLimiter = rateLimiter({
  windowMs: 1000 * 60 * 15,
  max: 5,
  message: "Too many requests from this IP addres, please try in another 15 minutes."
})

const router = express.Router();

router.route("/register").post(apiLimiter, validateRegister, isValid, registerUser);
router.route("/login").post(apiLimiter, validateLogin, isValid, loginUser);
router
  .route("/update")
  .patch(authMiddleWare, validateUpdateUser, isValid, updateUser);

export default router;
