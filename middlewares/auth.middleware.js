import { ApiRes } from "../utils/api.response.js";
import { asyncHandler } from "../utils/async.handler.js";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import { findUserById } from "../utils/helpers/auth.helper.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
  // Extract token from Authorization header (preferably) or cookies
  const authHeader = req.header("Authorization");
  const tokenFromHeader =
    authHeader && authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const token = tokenFromHeader || req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json(new ApiRes(401, null, "Unauthorized request."));
  }

  try {
    // Use promisified jwt.verify to avoid mixing async/await and callbacks
    const decodedToken = await promisify(jwt.verify)(
      token,
      process.env.ACCESS_TOKEN_SECRET,
    );

    // Fetch user details from DB
    const user = await findUserById(decodedToken.id, ["profile"]);

    if (!user) {
      return res
        .status(401)
        .json(new ApiRes(401, null, "Invalid access token."));
    }

    // Attach user details to the request object
    req.user = user;

    // Proceed to the next middleware
    next();
  } catch (err) {
    console.error(err);
    const message =
      err.name === "TokenExpiredError"
        ? "Token expired."
        : "Invalid access token.";
    return res.status(401).json(new ApiRes(401, null, message));
  }
});

export { verifyJWT };
