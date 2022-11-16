import express from "express";
import { registerUser, loginUser, updateUser } from "../controllers/userController";

const router = express.Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/update').patch(updateUser)

export default router

