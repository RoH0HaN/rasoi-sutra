import { EntitySchema } from "typeorm";

const ALLOWED_MEAL_TYPE = ["breakfast", "lunch", "dinner", "snack", "other"];

const MealType = Object.freeze({
  BREAKFAST: "breakfast",
  LUNCH: "lunch",
  DINNER: "dinner",
  SNACK: "snack",
  OTHER: "other",
});

const Recipe = new EntitySchema({
  name: "Recipe",
  tableName: "recipes",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    external_id: {
      type: "varchar", // ID from Spoonacular
      nullable: true,
    },
    title: {
      type: "varchar", // Recipe Name
    },
    description: {
      type: "varchar",
    },
    instructions: {
      type: "json",
    },
    cuisine_type: {
      type: "varchar", // e.g. italian, mexican, etc
    },
    meal_type: {
      type: "enum",
      enum: Object.values(MealType),
      default: MealType.OTHER,
    },
    cooking_time_minutes: {
      type: "int",
    },
    nutritional_info: {
      type: "json", // e.g. {calories: 100, protein: 10, carbs: 20, fat: 5}
    },
    image_url: {
      type: "varchar", // Recipe Image
      nullable: true,
    },
    created_at: { type: "timestamp", createDate: true },
    updated_at: { type: "timestamp", updateDate: true },
  },

  relations: {
    ingredients: {
      type: "one-to-many",
      target: "RecipeIngredient",
      inverseSide: "recipe", // matches RecipeIngredient.recipe
      cascade: true,
    },
    savedByUsers: {
      type: "one-to-many",
      target: "UserSavedRecipe",
      inverseSide: "recipe", // matches UserSavedRecipe.recipe
      cascade: true,
    },
    ratings: {
      type: "one-to-many",
      target: "RecipeRating",
      inverseSide: "recipe", // matches RecipeRating.recipe
      cascade: true,
    },
  },
});

export { Recipe, MealType, ALLOWED_MEAL_TYPE };
