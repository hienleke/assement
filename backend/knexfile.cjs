const path = require("node:path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const shared = {
  client: "pg",
  connection: process.env.DATABASE_URL,
  migrations: {
    directory: path.join(__dirname, "src/db/migrations"),
    loadExtensions: [".cjs"],
  },
  seeds: {
    directory: path.join(__dirname, "src/db/seeds"),
    loadExtensions: [".cjs"],
  },
};

module.exports = {
  development: shared,
  production: shared,
};
