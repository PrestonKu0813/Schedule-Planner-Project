const database_names = require("../../../enums/database_names");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(database_names.table.USER.GOOGLE, (table) => {
    table.string(database_names.user.GOOGLE.ID).primary();
    table.string(database_names.user.GOOGLE.GOOGLE_ID);
    table.string(database_names.user.GOOGLE.NAME);
    table.string(database_names.user.GOOGLE.SAVED_SCHEDULE);
    table.datetime(database_names.user.GOOGLE.SESSION);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable(database_names.table.USER.GOOGLE);
};
