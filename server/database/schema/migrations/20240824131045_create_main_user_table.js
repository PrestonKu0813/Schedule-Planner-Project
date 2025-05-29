const database_names = require("../../../enums/database_names");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(database_names.table.USER.MAIN, (table) => {
    table.string(database_names.user.MAIN.ID).primary();
    table.string(database_names.user.MAIN.PASSWORD);
    table.string(database_names.user.MAIN.NAME);
    table.datetime(database_names.user.MAIN.SESSION);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable(database_names.table.USER.MAIN);
};
