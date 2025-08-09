import { EntitySchema } from "typeorm";

const IngredientPreference = Object.freeze({
  LIKE: "like",
  DISLIKE: "dislike",
  AVOID: "avoid", // Allergies
});

const RecipeIngredient = new EntitySchema({
  name: "RecipeIngredient",
  tableName: "recipe_ingredients",
  columns: {
    recipe_id: {
      primary: true,
      type: "int",
    },
    ingredient_id: {
      primary: true,
      type: "int",
    },
    quantity: {
      type: "varchar", // e.g. 2 cups, 1 tbsp
      nullable: true,
    },
  },
  relations: {
    recipe: {
      type: "many-to-one",
      target: "Recipe",
      inverseSide: "ingredients", // matches Recipe.ingredients
      joinColumn: { name: "recipe_id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    ingredient: {
      type: "many-to-one",
      target: "Ingredient",
      inverseSide: "recipeIngredients", // matches Ingredient.recipeIngredients
      joinColumn: { name: "ingredient_id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
});

export { RecipeIngredient, IngredientPreference };
