import { recipeRatingRepo } from "../config/repositories.js";
import { asyncHandler } from "../utils/async.handler.js";
import { setCache, getCache, hasCache } from "../config/cache.js";
import { ApiRes } from "../utils/api.response.js";
import { validateFields } from "../utils/validate.fields.js";

/**
 * @param id - ID of the recipe
 */
const addRating = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rating, review } = req.body;

  if (!id) {
    return res.status(400).json(new ApiRes(400, null, "Missing recipe ID."));
  }

  const missingFields = validateFields(req.body, ["rating"], res);

  if (missingFields.length > 0) {
    return res
      .status(400)
      .json(
        new ApiRes(400, null, `Missing fields: ${missingFields.join(", ")}`),
      );
  }

  const isExists = await recipeRatingRepo.findOne({
    where: {
      user_id: req.user.id,
      recipe_id: id,
    },
  });

  if (isExists) {
    return res.status(400).json(new ApiRes(400, null, "Recipe already rated."));
  }

  const savedRecipe = await recipeRatingRepo.save({
    user_id: req.user.id,
    recipe_id: id,
    rating: rating,
    review: review,
  });

  if (!savedRecipe) {
    return res.status(500).json(new ApiRes(500, null, "Something went wrong."));
  }

  return res.status(200).json(new ApiRes(200, savedRecipe, "Recipe rated."));
});

/**
 * @param id - ID of the recipe
 */
const deleteRating = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json(new ApiRes(400, null, "Missing recipe ID."));
  }

  const isExists = await recipeRatingRepo.findOne({
    where: {
      user_id: req.user.id,
      recipe_id: id,
    },
  });

  if (!isExists) {
    return res.status(400).json(new ApiRes(400, null, "Recipe not rated."));
  }

  const deletedRecipe = await recipeRatingRepo.delete({
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
const getAllRatingsOfRecipe = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { page, limit } = req.query;

  if (!id) {
    return res.status(400).json(new ApiRes(400, null, "Missing recipe ID."));
  }

  page = Number(page);
  limit = Number(limit);

  if (!page || page < 1) page = 1;
  if (!limit || limit < 1) limit = 10;

  const skip = (page - 1) * limit;

  const cacheKey = `recipe-ratings:${id}:${page}:${limit}`;

  if (hasCache(cacheKey)) {
    const cached = getCache(cacheKey);
    return res
      .status(200)
      .json(new ApiRes(200, cached, "Recipe ratings fetched from cache."));
  }

  const recipeRatings = await recipeRatingRepo.find({
    where: {
      recipe_id: id,
    },
    relations: {
      user: true,
    },
    skip,
    take: limit,
  });

  setCache(cacheKey, recipeRatings);

  return res.status(200).json({
    status: 200,
    data: recipeRatings,
    message: "Recipe ratings fetched.",
  });
});

export { addRating, deleteRating, getAllRatingsOfRecipe };
