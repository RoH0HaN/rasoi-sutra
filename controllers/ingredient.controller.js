import { asyncHandler } from "../utils/async.handler.js";
import { validateFields } from "../utils/validate.fields.js";
import { ingredientRepo } from "../config/repositories.js";
import { ApiRes } from "../utils/api.response.js";
import { ALLOWED_CATEGORY } from "../entities/ingredient.js";
import {
  findIngredientById,
  findIngredientByName,
  findIngredients,
} from "../utils/helpers/ingredient.helper.js";

const addNewIngredient = asyncHandler(async (req, res) => {
  const { name, category } = req.body;

  const missingFields = validateFields(req.body, ["name", "category"], res);

  if (missingFields.length > 0) {
    return res
      .status(400)
      .json(
        new ApiRes(400, null, `Missing fields: ${missingFields.join(", ")}`),
      );
  }

  if (!ALLOWED_CATEGORY.includes(category)) {
    return res.status(400).json(new ApiRes(400, null, "Invalid category."));
  }

  const ingredientExists = await findIngredientByName(name);

  if (ingredientExists) {
    return res
      .status(400)
      .json(new ApiRes(400, null, "Ingredient already exists."));
  }

  const ingredient = await ingredientRepo.save({
    name,
    category,
  });

  if (!ingredient) {
    return res.status(500).json(new ApiRes(500, null, "Something went wrong."));
  }

  return res
    .status(201)
    .json(new ApiRes(201, ingredient, "Ingredient added successfully."));
});

const getAllIngredients = asyncHandler(async (req, res) => {
  const { category } = req.query;

  const whereCondition = category ? { category } : {};

  const ingredients = await findIngredients(whereCondition);

  return res
    .status(200)
    .json(new ApiRes(200, ingredients, "Ingredients fetched successfully."));
});

const updateIngredient = asyncHandler(async (req, res) => {
  const { name, category } = req.body;

  const missingFields = validateFields(req.body, ["name", "category"], res);

  if (missingFields.length > 0) {
    return res
      .status(400)
      .json(
        new ApiRes(400, null, `Missing fields: ${missingFields.join(", ")}`),
      );
  }

  if (!ALLOWED_CATEGORY.includes(category)) {
    return res.status(400).json(new ApiRes(400, null, "Invalid category."));
  }

  const ingredientExists = await findIngredientById(req.params.id);

  if (!ingredientExists) {
    return res.status(404).json(new ApiRes(404, null, "Ingredient not found."));
  }

  const updatedIngredient = await ingredientRepo.save({
    id: ingredientExists.id,
    name,
    category,
  });

  return res.status(200).json({
    status: 200,
    data: updatedIngredient,
    message: "Ingredient updated successfully.",
  });
});

const deleteIngredient = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const ingredient = await findIngredientById(id);

  if (!ingredient) {
    return res.status(404).json(new ApiRes(404, null, "Ingredient not found."));
  }

  await ingredientRepo.remove(ingredient);

  return res
    .status(200)
    .json(new ApiRes(200, null, "Ingredient deleted successfully."));
});

export {
  addNewIngredient,
  getAllIngredients,
  updateIngredient,
  deleteIngredient,
};
