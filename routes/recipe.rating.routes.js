import { Router } from "express";
import {
  addRating,
  deleteRating,
  getAllRatingsOfRecipe,
} from "../controllers/recipe.rating.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeAccessPermissions } from "../middlewares/access.middleware.js";
import { Role } from "../entities/user.js";

const router = Router();

router.post(
  "add/:id",
  verifyJWT,
  authorizeAccessPermissions(Role.USER),
  addRating,
);
router.get(
  "get/:id",
  verifyJWT,
  authorizeAccessPermissions(Role.USER),
  getAllRatingsOfRecipe,
);
router.delete(
  "delete/:id",
  verifyJWT,
  authorizeAccessPermissions(Role.USER),
  deleteRating,
);

export default router;
