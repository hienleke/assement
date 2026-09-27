import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { required } from "@/utils/helper.js";

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

dotenv.config({ path: path.join(backendRoot, ".env") });

export const port = Number(required("PORT", "3000"));
export const databaseUrl = required(
  "DATABASE_URL",
  "postgres://postgres:postgres@localhost:5432/assessment",
);
