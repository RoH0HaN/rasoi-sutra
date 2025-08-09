import { EntitySchema } from "typeorm";

const RecipeRating = new EntitySchema({
  name: "RecipeRating",
  tableName: "recipe_ratings",
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
      type: "int",
    },
    rating: {
      type: "int",
    },
    review: {
      type: "varchar",
      nullable: true,
    },
    created_at: {
      type: "timestamp",
      createDate: true,
    },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      inverseSide: "recipeRatings", // matches User.recipeRatings
      joinColumn: { name: "user_id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    recipe: {
      type: "many-to-one",
      target: "Recipe",
      inverseSide: "ratings", // matches Recipe.ratings
      joinColumn: { name: "recipe_id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
});

export { RecipeRating };
