import { EntitySchema } from "typeorm";

const ALLOWED_DIET = ["vegetarian", "vegan", "pescatarian", "none"];
const ALLOWED_SKILL = ["beginner", "intermediate", "expert"];

const Role = Object.freeze({
  USER: "user",
  ADMIN: "admin",
});

const User = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: { type: "varchar" },
    email: { type: "varchar", unique: true },
    role: {
      type: "enum",
      enum: Object.values(Role),
      default: Role.USER,
    },
    password_hash: { type: "varchar" },
    refresh_token: { type: "varchar", nullable: true },
    created_at: { type: "timestamp", createDate: true },
    updated_at: { type: "timestamp", updateDate: true },
  },
  relations: {
    profile: {
      type: "one-to-one",
      target: "UserProfile",
      inverseSide: "user", // matches UserProfile.user
      cascade: true,
    },
    ingredientPreferences: {
      type: "one-to-many",
      target: "UserIngredientPreference",
      inverseSide: "user", // matches UserIngredientPreference.user
      cascade: true,
    },
    savedRecipes: {
      type: "one-to-many",
      target: "UserSavedRecipe",
      inverseSide: "user", // matches UserSavedRecipe.user
      cascade: true,
    },
    recipeRatings: {
      type: "one-to-many",
      target: "RecipeRating",
      inverseSide: "user", // matches RecipeRating.user
      cascade: true,
    },
  },
});

export { User, Role, ALLOWED_DIET, ALLOWED_SKILL };
