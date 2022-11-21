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

const router = express.Router();

router.route("/register").post(validateRegister, isValid, registerUser);
router.route("/login").post(validateLogin, isValid, loginUser);
router
  .route("/update")
  .patch(authMiddleWare, validateUpdateUser, isValid, updateUser);

export default router;
