import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userRepo } from "../../config/repositories.js";

const verifyEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim().toLowerCase());
};

const comparePassword = async (hash, password) => {
  return bcrypt.compare(password, hash);
};

const hashPassword = async (password) => {
  return bcrypt.hash(password, 8);
};

const generateAccessToken = async (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  );
};

const generateRefreshToken = async (user) => {
  return jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

// DB Related Helpers
const findUserByEmail = async (email, relations = []) => {
  return userRepo.findOne({
    where: { email },
    relations: relations.length > 0 ? relations : undefined,
  });
};

const findUserById = async (id, relations = []) => {
  return userRepo.findOne({
    where: { id },
    relations: relations.length > 0 ? relations : undefined,
  });
};

export {
  verifyEmail,
  comparePassword,
  hashPassword,
  generateAccessToken,
  generateRefreshToken,
  findUserByEmail,
  findUserById,
};
