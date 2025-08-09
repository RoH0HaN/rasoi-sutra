import { Router } from "express";
import { getRecipes } from "../controllers/recipe.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeAccessPermissions } from "../middlewares/access.middleware.js";
import { Role } from "../entities/user.js";

const router = Router();

router.get("/", verifyJWT, authorizeAccessPermissions(Role.ADMIN), getRecipes);

export default router;
