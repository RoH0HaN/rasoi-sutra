import { asyncHandler } from "../utils/async.handler.js";
import { setCache, getCache, hasCache } from "../config/cache.js";
import { ApiRes } from "../utils/api.response.js";
import { ALLOWED_DIET } from "../entities/user.js";
import { spoonacularRequest } from "../utils/helpers/spoonacular.helper.js";

const getRecipes = asyncHandler(async (req, res) => {
  let {
    cuisine,
    mealType,
    diet,
    maxReadyTime,
    includeIngredients,
    page,
    limit,
  } = req.query;

  if (
    mealType &&
    !["breakfast", "lunch", "dinner", "snack", "teatime"].includes(mealType)
  ) {
    return res.status(400).json(new ApiRes(400, null, "Invalid meal type."));
  }

  if (diet && !ALLOWED_DIET.includes(diet)) {
    return res
      .status(400)
      .json(new ApiRes(400, null, "Invalid dietary preference."));
  }

  if (!diet && req.user?.profile?.dietary_preference) {
    diet = req.user.profile.dietary_preference;
  }

  page = Number(page);
  limit = Number(limit);

  if (!page || page < 1) page = 1;
  if (!limit || limit < 1) limit = 10;

  if (maxReadyTime && (isNaN(maxReadyTime) || Number(maxReadyTime) < 1)) {
    return res
      .status(400)
      .json(new ApiRes(400, null, "maxReadyTime must be a positive number"));
  }

  const cacheKey = `recipes:${JSON.stringify({
    cuisine,
    mealType,
    diet,
    maxReadyTime,
    includeIngredients,
    page,
    limit,
  })}`;

  if (hasCache(cacheKey)) {
    const cached = getCache(cacheKey);
    return res
      .status(200)
      .json(new ApiRes(200, cached, "Recipes fetched from cache."));
  }

  const spoonacularParams = {
    cuisine,
    type: mealType,
    diet,
    maxReadyTime,
    includeIngredients,
    number: limit,
    offset: (page - 1) * limit,
  };

  Object.keys(spoonacularParams).forEach(
    (key) => spoonacularParams[key] == null && delete spoonacularParams[key],
  );

  const apiResults = await spoonacularRequest(
    "/recipes/complexSearch",
    spoonacularParams,
  );

  setCache(cacheKey, apiResults);

  return res
    .status(200)
    .json(new ApiRes(200, apiResults, "Recipes fetched from Spoonacular API."));
});

/**
 * @param id - ID of the recipe
 */
const getRecipeDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json(new ApiRes(400, null, "Missing recipe ID."));
  }

  const cacheKey = `recipe-details:${id}`;

  if (hasCache(cacheKey)) {
    const cached = getCache(cacheKey);
    return res
      .status(200)
      .json(new ApiRes(200, cached, "Recipe details fetched from cache."));
  }

  const apiResults = await spoonacularRequest(`/recipes/${id}/information`, {
    includeNutrition: true,
  });

  setCache(cacheKey, apiResults);

  return res
    .status(200)
    .json(
      new ApiRes(
        200,
        apiResults,
        "Recipe details fetched from Spoonacular API.",
      ),
    );
});

export { getRecipes, getRecipeDetails };
