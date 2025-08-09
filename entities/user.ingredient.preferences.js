import { EntitySchema } from "typeorm";

const ALLOWED_PREFERENCE = [
  "like",
  "dislike",
  "avoid", // Allergies
  "none",
];

const IngredientPreference = Object.freeze({
  LIKE: "like",
  DISLIKE: "dislike",
  AVOID: "avoid", // Allergies
  NONE: "none",
});

const UserIngredientPreference = new EntitySchema({
  name: "UserIngredientPreference",
  tableName: "user_ingredient_preferences",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    user_id: {
      type: "int",
    },
    ingredient_id: {
      type: "int",
    },
    preference_type: {
      type: "enum",
      enum: Object.values(IngredientPreference),
      default: IngredientPreference.NONE, // Default to dislike
    },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      inverseSide: "ingredientPreferences", // matches User.ingredientPreferences
      joinColumn: { name: "user_id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    ingredient: {
      type: "many-to-one",
      target: "Ingredient",
      inverseSide: "preferences", // matches Ingredient.preferences
      joinColumn: { name: "ingredient_id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
});

export { UserIngredientPreference, IngredientPreference, ALLOWED_PREFERENCE };
