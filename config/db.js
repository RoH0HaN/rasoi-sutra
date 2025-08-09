import "reflect-metadata";
import { DataSource } from "typeorm";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config(); // ✅ load env variables

// Get __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB = new DataSource({
  type: process.env.DB_TYPE, // mysql
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false,
  entities: [path.join(__dirname, "../entities/*.js")],
  synchronize: true,
});

export { DB };
