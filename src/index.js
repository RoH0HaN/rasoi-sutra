import dotenv from "dotenv";
import { app } from "./app.js";
import { consoleLogger } from "../utils/logger.js";
import { DB } from "../config/db.js";

dotenv.config({
  path: "./.env",
});

DB.initialize()
  .then(() => {
    app.listen(process.env.PORT || 3001, () => {
      consoleLogger.info(
        `MySQL Connected | HTTP Server is listening | PORT: ${process.env.PORT || 3000}`,
      );
      console.log(
        "Entities loaded:",
        DB.entityMetadatas.map((e) => e.name),
      );
    });
  })
  .catch((error) => {
    consoleLogger.error("MySQL connection error | Error: ", error);
    process.exit(1);
  });

app.all("/", (_, res) => {
  consoleLogger.info("Just got a request for Rasoi Sutra API's.");
  res.send(`
        <center>
          <b style="font-size: 42px;">
            Rasoi Sutra Backend API's are running!<br>
            Apparently, it is running on port ${process.env.PORT || 3000}.
            <br>
            <br>
            <b style="font-size: 32px;">👨‍💻 Akash Samanta</b>
          </b>
        </center>
      `);
});

app.get("/health", (_, res) => res.send("Healthy"));
