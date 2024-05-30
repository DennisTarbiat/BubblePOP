// Update with the config settings.
const dotenv = require("dotenv");
const { join } = require("path");
dotenv.config({ path: join(__dirname, ".env") });

/** Setting up database information
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: process.env.DB_PORT,
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
};
