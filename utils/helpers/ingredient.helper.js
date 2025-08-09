import { ingredientRepo } from "../../config/repositories.js";

// DB Related Helpers
const findIngredientByName = async (name, relations = []) => {
  return ingredientRepo.findOne({
    where: { name },
    relations: relations.length > 0 ? relations : undefined,
  });
};

const findIngredientById = async (id, relations = []) => {
  return ingredientRepo.findOne({
    where: { id },
    relations: relations.length > 0 ? relations : undefined,
  });
};

const findIngredients = async (whereCondition, relations = []) => {
  return ingredientRepo.find({
    where: whereCondition,
    relations: relations.length > 0 ? relations : undefined,
  });
};

export { findIngredientByName, findIngredientById, findIngredients };
