import { userSavedRecipeRepo } from "../config/repositories.js";
import { asyncHandler } from "../utils/async.handler.js";
import { setCache, getCache, hasCache } from "../config/cache.js";
import { ApiRes } from "../utils/api.response.js";

/**
 * @param id - ID of the recipe
 */
const saveRecipe = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json(new ApiRes(400, null, "Missing recipe ID."));
  }

  const isExists = await userSavedRecipeRepo.findOne({
    where: {
      user_id: req.user.id,
      recipe_id: id,
    },
  });

  if (isExists) {
    return res.status(400).json(new ApiRes(400, null, "Recipe already saved."));
  }

  const savedRecipe = await userSavedRecipeRepo.save({
    user_id: req.user.id,
    recipe_id: id,
  });

  if (!savedRecipe) {
    return res.status(500).json(new ApiRes(500, null, "Something went wrong."));
  }

  return res.status(200).json(new ApiRes(200, savedRecipe, "Recipe saved."));
});

/**
 * @param id - ID of the recipe
 */
const removeRecipe = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json(new ApiRes(400, null, "Missing recipe ID."));
  }

  const isExists = await userSavedRecipeRepo.findOne({
    where: {
      user_id: req.user.id,
      recipe_id: id,
    },
  });

  if (!isExists) {
    return res.status(400).json(new ApiRes(400, null, "Recipe not saved."));
  }

  const deletedRecipe = await userSavedRecipeRepo.delete({
    user_id: req.user.id,
    recipe_id: id,
  });

  if (!deletedRecipe) {
    return res.status(500).json(new ApiRes(500, null, "Something went wrong."));
  }

  return res
    .status(200)
    .json(new ApiRes(200, deletedRecipe, "Recipe removed."));
});

/**
 * @param id - ID of the recipe
 */
const getSavedRecipes = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;

  page = Number(page);
  limit = Number(limit);

  if (!page || page < 1) page = 1;
  if (!limit || limit < 1) limit = 10;

  const skip = (page - 1) * limit;

  const cacheKey = `saved-recipes:${req.user.id}:${page}:${limit}`;

  if (hasCache(cacheKey)) {
    const cached = getCache(cacheKey);
    return res
      .status(200)
      .json(new ApiRes(200, cached, "Saved recipes fetched from cache."));
  }

  const savedRecipes = await userSavedRecipeRepo.find({
    where: {
      user_id: req.user.id,
    },
    relations: {
      recipe: true,
    },
    skip,
    take: limit,
  });

  setCache(cacheKey, savedRecipes);

  return res
    .status(200)
    .json(new ApiRes(200, savedRecipes, "Saved recipes fetched."));
});

export { saveRecipe, removeRecipe, getSavedRecipes };
