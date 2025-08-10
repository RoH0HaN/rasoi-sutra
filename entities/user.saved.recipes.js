import { EntitySchema } from "typeorm";

const UserSavedRecipe = new EntitySchema({
  name: "UserSavedRecipe",
  tableName: "user_saved_recipes",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    user_id: {
      type: "int",
    },
    recipe_id: {
      type: "varchar", // ID from Spoonacular
    },
    saved_at: {
      type: "timestamp",
      createDate: true,
    },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      inverseSide: "savedRecipes", // matches User.savedRecipes
      joinColumn: { name: "user_id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
});

export { UserSavedRecipe };
