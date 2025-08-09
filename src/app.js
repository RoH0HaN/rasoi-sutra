import express from "express";
import cors from "cors";
import morgan from "morgan";
import { consoleLogger, httpFileLogger } from "../utils/logger.js";
import { errorHandler } from "../middlewares/error.middleware.js";
import cookieParser from "cookie-parser";

const corsOption = {
  origin: process.env.CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "x-refresh-token"],
};

const morganFormat = ":method :url :status :response-time ms";
const apiVersion = "/api/v1";

const app = express();

app.use(cors(corsOption));
app.use(express.json({ limit: "24kb" }));
app.use(express.urlencoded({ limit: "24kb", extended: true }));
app.use(cookieParser());

// --- MORGAN LOGGING MIDDLEWARE --->
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };

        consoleLogger.info(
          `(STATUS CODE: ${logObject.status}) => Method: ${logObject.method} | URL: '${logObject.url}' - [${logObject.responseTime}ms]`,
        );

        httpFileLogger.info(message);
      },
    },
  }),
);

// --- ROUTES IMPORTS --->
import authRoutes from "../routes/auth.routes.js";
import ingredientRoute from "../routes/ingredient.routes.js";
import userProfileRoutes from "../routes/user.profile.routes.js";
import recipeRoutes from "../routes/recipe.routes.js";

// --- ROUTES MIDDLEWARES --->
app.use(`${apiVersion}/auth`, authRoutes);
app.use(`${apiVersion}/ingredients`, ingredientRoute);
app.use(`${apiVersion}/profile`, userProfileRoutes);
app.use(`${apiVersion}/recipes`, recipeRoutes);

// --- ERROR HANDLER MIDDLEWARE --->
app.use(errorHandler);

export { app };
