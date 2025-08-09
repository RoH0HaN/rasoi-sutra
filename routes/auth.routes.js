import { Router } from "express";
import {
  register,
  login,
  logout,
  getUserData,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", verifyJWT, logout);
router.get("/me", verifyJWT, getUserData);

export default router;
