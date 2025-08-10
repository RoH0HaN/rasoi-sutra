import { Router } from "express";
import {
  getSavedRecipes,
  removeRecipe,
  saveRecipe,
} from "../controllers/user.saved.recipe.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeAccessPermissions } from "../middlewares/access.middleware.js";
import { Role } from "../entities/user.js";

const router = Router();

router.get(
  "/",
  verifyJWT,
  authorizeAccessPermissions(Role.USER),
  getSavedRecipes,
);
router.post(
  "save/:id",
  verifyJWT,
  authorizeAccessPermissions(Role.USER),
  saveRecipe,
);
router.delete(
  "remove/:id",
  verifyJWT,
  authorizeAccessPermissions(Role.USER),
  removeRecipe,
);

export default router;
