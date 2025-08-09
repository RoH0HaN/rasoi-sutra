import { asyncHandler } from "../utils/async.handler.js";
import { validateFields } from "../utils/validate.fields.js";
import { User, ALLOWED_DIET, ALLOWED_SKILL, Role } from "../entities/user.js";
import { userRepo, userProfileRepo } from "../config/repositories.js";
import { ApiRes } from "../utils/api.response.js";
import {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  verifyEmail,
  findUserByEmail,
} from "../utils/helpers/auth.helper.js";

/**
 * @param dietary_preferences - ENUM - vegetarian, vegan, non-vegan, pescatarian, omnivore
 * @param allergies - Array - List of allergies
 * @param cooking_skill_level - ENUM - beginner, intermediate, advanced
 */
const register = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    dietary_preference,
    allergies,
    cooking_skill_level,
  } = req.body;

  const missingFields = validateFields(
    req.body,
    [
      "name",
      "email",
      "password",
      "dietary_preference",
      "allergies",
      "cooking_skill_level",
    ],
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

  if (!verifyEmail(email)) {
    return res.status(400).json(new ApiRes(400, null, "Invalid email format."));
  }

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    return res
      .status(400)
      .json(new ApiRes(400, null, "User with this email already exists."));
  }

  const hashedPassword = await hashPassword(password);

  const user = await userRepo.save({
    name,
    email,
    password_hash: hashedPassword,
  });

  if (!user) {
    return res
      .status(500)
      .json(new ApiRes(500, null, "User registration failed."));
  }

  const userProfile = userProfileRepo.create({
    dietary_preference,
    allergies,
    cooking_skill_level,
    user, // <— pass the whole entity
  });
  // This way TypeORM uses the defined relation and will also correctly populate user_id in the database

  await userProfileRepo.save(userProfile);

  if (!userProfile) {
    return res
      .status(500)
      .json(new ApiRes(500, null, "User profile registration failed."));
  }

  const accessToken = await generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user);

  user.refresh_token = refreshToken;
  await userRepo.save(user);

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiRes(201, null, "User registered successfully."));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const missingFields = validateFields(req.body, ["email", "password"], res);

  if (missingFields.length > 0) {
    return res
      .status(400)
      .json(
        new ApiRes(400, null, `Missing fields: ${missingFields.join(", ")}`),
      );
  }

  if (!verifyEmail(email)) {
    return res.status(400).json(new ApiRes(400, null, "Invalid email format."));
  }

  const user = await findUserByEmail(email);

  if (!user) {
    return res.status(401).json(new ApiRes(401, null, "Invalid email."));
  }

  const isPasswordValid = await comparePassword(user.password_hash, password);

  if (!isPasswordValid) {
    return res.status(401).json(new ApiRes(401, null, "Invalid password."));
  }

  const accessToken = await generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user);

  user.refresh_token = refreshToken;
  await userRepo.save(user);

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiRes(200, { accessToken }, "logged in successfully."));
});

const logout = asyncHandler(async (req, res) => {
  const user = await findUserByEmail(req.user.email);

  user.refresh_token = null;
  await userRepo.save(user);

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };

  // Clear both access and refresh tokens cookies
  res
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .status(200)
    .json(new ApiRes(200, null, "User logged out successfully."));
});

const getUserData = asyncHandler(async (req, res) => {
  const user = await findUserByEmail(req.user.email, ["profile"]);

  if (!user) {
    return res.status(404).json(new ApiRes(404, null, "User not found."));
  }

  if (req.user.role === Role.ADMIN) {
    return res
      .status(200)
      .json(new ApiRes(200, user, "User data retrieved successfully."));
  }

  const resData = {
    id: user.id,
    name: user.name,
    email: user.email,
    dietary_preference: user.profile.dietary_preference,
    allergies: user.profile.allergies,
    cooking_skill_level: user.profile.cooking_skill_level,
  };

  return res
    .status(200)
    .json(new ApiRes(200, resData, "User data retrieved successfully."));
});

export { register, login, logout, getUserData };
