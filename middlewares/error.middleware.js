import { ApiRes } from "../utils/api.response.js";
import { consoleLogger, httpFileLogger } from "../utils/logger.js";

const errorHandler = (err, req, res, next) => {
  console.error(err);
  consoleLogger.error(err.message);
  httpFileLogger.error(err);
  return res.status(err.status || 500).json(new ApiRes(500, null, err.message));
};

export { errorHandler };
