exports.up = function up(knex) {
  return knex.schema.createTable("mqtt_messages", (table) => {
    table.increments("id").primary();
    table.text("topic").notNullable().index();
    table.jsonb("payload").notNullable();
    table.timestamp("received_at", { useTz: true }).notNullable().defaultTo(knex.fn.now()).index();
  });
};

exports.down = function down(knex) {
  return knex.schema.dropTableIfExists("mqtt_messages");
};
