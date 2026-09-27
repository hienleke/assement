import knex from "knex";
import { databaseUrl } from "@/config/db.config.js";

export const db = knex({
  client: "pg",
  connection: databaseUrl,
});
