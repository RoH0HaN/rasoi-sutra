import { DB } from "./db.js";
import { User } from "../entities/user.js";
import { UserProfile } from "../entities/user.profile.js";
import { Ingredient } from "../entities/ingredient.js";
import { RecipeRating } from "../entities/recipe.rating.js";
import { UserSavedRecipe } from "../entities/user.saved.recipes.js";
import { UserIngredientPreference } from "../entities/user.ingredient.preferences.js";
import { ApiCache } from "../entities/api.cache.js";

const userRepo = DB.getRepository(User);
const userProfileRepo = DB.getRepository(UserProfile);
const ingredientRepo = DB.getRepository(Ingredient);
const recipeRatingRepo = DB.getRepository(RecipeRating);
const userSavedRecipeRepo = DB.getRepository(UserSavedRecipe);
const userIngredientPreferenceRepo = DB.getRepository(UserIngredientPreference);
const apiCacheRepo = DB.getRepository(ApiCache);

export {
  userRepo,
  userProfileRepo,
  ingredientRepo,
  recipeRatingRepo,
  userSavedRecipeRepo,
  userIngredientPreferenceRepo,
  apiCacheRepo,
};
