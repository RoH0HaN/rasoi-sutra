import { Router } from "express";
import {
  addIngredientPreference,
  deleteIngredientPreference,
  getUserProfile,
  updateProfile,
  updateIngredientPreference,
} from "../controllers/user.profile.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeAccessPermissions } from "../middlewares/access.middleware.js";
import { Role } from "../entities/user.js";

const router = Router();

router.get(
  "/",
  verifyJWT,
  authorizeAccessPermissions(Role.USER),
  getUserProfile,
);
router.put(
  "/",
  verifyJWT,
  authorizeAccessPermissions(Role.USER),
  updateProfile,
);
router.post(
  "/ingredient-preference",
  verifyJWT,
  authorizeAccessPermissions(Role.USER),
  addIngredientPreference,
);
router.put(
  "/ingredient-preference/:id",
  verifyJWT,
  authorizeAccessPermissions(Role.USER),
  updateIngredientPreference,
);
router.delete(
  "/ingredient-preference/:id",
  verifyJWT,
  authorizeAccessPermissions(Role.USER),
  deleteIngredientPreference,
);

export default router;
