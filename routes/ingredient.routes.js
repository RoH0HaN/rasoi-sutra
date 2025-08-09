import { Router } from "express";
import {
  addNewIngredient,
  deleteIngredient,
  getAllIngredients,
  updateIngredient,
} from "../controllers/ingredient.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeAccessPermissions } from "../middlewares/access.middleware.js";
import { Role } from "../entities/user.js";

const router = Router();

router.post(
  "/",
  verifyJWT,
  authorizeAccessPermissions(Role.ADMIN),
  addNewIngredient,
);
router.get("/", getAllIngredients);
router.put(
  "/:id",
  verifyJWT,
  authorizeAccessPermissions(Role.ADMIN),
  updateIngredient,
);
router.delete(
  "/:id",
  verifyJWT,
  authorizeAccessPermissions(Role.ADMIN),
  deleteIngredient,
);

export default router;
