import { asyncHandler } from "../utils/async.handler.js";
import { validateFields } from "../utils/validate.fields.js";
import { User, ALLOWED_DIET, ALLOWED_SKILL } from "../entities/user.js";
import {
  userRepo,
  userProfileRepo,
  userIngredientPreferenceRepo,
} from "../config/repositories.js";
import { ApiRes } from "../utils/api.response.js";
import { ALLOWED_PREFERENCE } from "../entities/user.ingredient.preferences.js";
import { findUserById } from "../utils/helpers/auth.helper.js";

const addIngredientPreference = asyncHandler(async (req, res) => {
  const { ingredientId, preferenceType } = req.body;

  const missingFields = validateFields(
    req.body,
    ["ingredientId", "preferenceType"],
    res,
  );

  if (missingFields.length > 0) {
    return res
      .status(400)
      .json(
        new ApiRes(400, null, `Missing fields: ${missingFields.join(", ")}`),
      );
  }

  if (!ALLOWED_PREFERENCE.includes(preferenceType)) {
    return res
      .status(400)
      .json(new ApiRes(400, null, "Invalid preference type."));
  }

  const isPreferenceExists = await userIngredientPreferenceRepo.findOne({
    where: {
      user_id: req.user.id,
      ingredient_id: ingredientId,
    },
  });

  if (isPreferenceExists) {
    return res
      .status(400)
      .json(new ApiRes(400, null, "Preference already exists."));
  }

  const UserIngredientPreference = await userIngredientPreferenceRepo.save({
    user_id: req.user.id,
    ingredient_id: ingredientId,
    preference_type: preferenceType,
  });

  if (!UserIngredientPreference) {
    return res.status(500).json(new ApiRes(500, null, "Something went wrong."));
  }

  return res
    .status(200)
    .json(
      new ApiRes(
        200,
        UserIngredientPreference,
        "Preference added successfully.",
      ),
    );
});

const updateIngredientPreference = asyncHandler(async (req, res) => {
  const { preferenceType } = req.body;

  const missingFields = validateFields(
    req.body,
    ["ingredientId", "preferenceType"],
    res,
  );

  if (missingFields.length > 0) {
    return res
      .status(400)
      .json(
        new ApiRes(400, null, `Missing fields: ${missingFields.join(", ")}`),
      );
  }

  if (!ALLOWED_PREFERENCE.includes(preferenceType)) {
    return res
      .status(400)
      .json(new ApiRes(400, null, "Invalid preference type."));
  }

  const isPreferenceExists = await userIngredientPreferenceRepo.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!isPreferenceExists) {
    return res.status(400).json(new ApiRes(400, null, "Preference not found."));
  }

  const updatedPreference = await userIngredientPreferenceRepo.save({
    id: isPreferenceExists.id,
    preference_type: preferenceType,
  });

  if (!updatedPreference) {
    return res.status(500).json(new ApiRes(500, null, "Something went wrong."));
  }

  return res
    .status(200)
    .json(
      new ApiRes(200, updatedPreference, "Preference updated successfully."),
    );
});

const deleteIngredientPreference = asyncHandler(async (req, res) => {
  const missingFields = validateFields(req.body, ["ingredientId"], res);

  if (missingFields.length > 0) {
    return res
      .status(400)
      .json(
        new ApiRes(400, null, `Missing fields: ${missingFields.join(", ")}`),
      );
  }

  const isPreferenceExists = await userIngredientPreferenceRepo.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!isPreferenceExists) {
    return res.status(400).json(new ApiRes(400, null, "Preference not found."));
  }

  const deletedPreference = await userIngredientPreferenceRepo.delete({
    id: isPreferenceExists.id,
  });

  if (!deletedPreference) {
    return res.status(500).json(new ApiRes(500, null, "Something went wrong."));
  }

  return res
    .status(200)
    .json(
      new ApiRes(200, deletedPreference, "Preference deleted successfully."),
    );
});

const getUserProfile = asyncHandler(async (req, res) => {
  const userData = await findUserById(req.user.id, [
    "profile",
    "ingredientPreferences",
  ]);

  if (!userData) {
    return res.status(404).json(new ApiRes(404, null, "User not found."));
  }

  const resData = {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    profile: {
      dietary_preference: userData.profile.dietary_preference,
      allergies: userData.profile.allergies,
      cooking_skill_level: userData.profile.cooking_skill_level,
    },
    ingredient_preferences: userData.ingredientPreferences,
  };

  return res.status(200).json(new ApiRes(200, resData, "Profile found."));
});

const updateProfile = asyncHandler(async (req, res) => {
  const { dietary_preference, allergies, cooking_skill_level } = req.body;

  const missingFields = validateFields(
    req.body,
    ["dietary_preference", "allergies", "cooking_skill_level"],
    res,
  );

  if (missingFields.length > 0) {
    return res
      .status(400)
      .json(
        new ApiRes(400, null, `Missing fields: ${missingFields.join(", ")}`),
      );
  }

  if (!ALLOWED_DIET.includes(dietary_preference)) {
    return res
      .status(400)
      .json(new ApiRes(400, null, "Invalid dietary preference."));
  }
  if (!ALLOWED_SKILL.includes(cooking_skill_level)) {
    return res
      .status(400)
      .json(new ApiRes(400, null, "Invalid cooking skill level."));
  }

  const updatedProfile = await userProfileRepo.save({
    user_id: req.user.id,
    dietary_preference,
    allergies,
    cooking_skill_level,
  });

  if (!updatedProfile) {
    return res.status(500).json(new ApiRes(500, null, "Something went wrong."));
  }

  return res
    .status(200)
    .json(new ApiRes(200, updatedProfile, "Profile updated successfully."));
});

export {
  addIngredientPreference,
  deleteIngredientPreference,
  getUserProfile,
  updateProfile,
  updateIngredientPreference,
};
