import knex from "knex";
import { config } from "@/config/config.js";

export const db = knex({
  client: "pg",
  connection: config.databaseUrl,
});
