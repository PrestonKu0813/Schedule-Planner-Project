/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  // Convert string column to JSON type
  await knex.raw(`
    ALTER TABLE google_user 
    MODIFY COLUMN saved_schedule JSON
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  // Revert back to string type
  await knex.raw(`
    ALTER TABLE google_user 
    MODIFY COLUMN saved_schedule VARCHAR(10000)
  `);
};
