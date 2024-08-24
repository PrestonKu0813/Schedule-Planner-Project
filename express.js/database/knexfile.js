// require("dotenv").config();

/* 
running knex migration in database folder directory
require("dotenv").config({ path: `../env/.env.${process.env.ENV}` });
*/

require("dotenv").config({ path: `./env/.env.${process.env.ENV}` });

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      database: process.env.DB_DATABASE,
    },
    migrations: {
      directory: "./schema/migrations",
    },
  },
};
