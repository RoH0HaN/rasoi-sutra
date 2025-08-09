import { EntitySchema } from "typeorm";

const ALLOWED_CATEGORY = [
  "vegetable",
  "meat",
  "spice",
  "fruit",
  "dairy",
  "other",
];

const Category = Object.freeze({
  VEGETABLE: "vegetable",
  MEAT: "meat",
  SPICE: "spice",
  FRUIT: "fruit",
  DAIRY: "dairy",
  OTHER: "other",
});

const Ingredient = new EntitySchema({
  name: "Ingredient",
  tableName: "ingredients",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
    },
    category: {
      type: "enum",
      enum: Object.values(Category),
      default: Category.OTHER, // Default to OTHER
    },
  },
  relations: {
    preferences: {
      type: "one-to-many",
      target: "UserIngredientPreference",
      inverseSide: "ingredient", // matches UserIngredientPreference.ingredient
      cascade: true,
    },
    recipeIngredients: {
      type: "one-to-many",
      target: "RecipeIngredient",
      inverseSide: "ingredient", // matches RecipeIngredient.ingredient
      cascade: true,
    },
  },
});

export { ALLOWED_CATEGORY, Ingredient };
