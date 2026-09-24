
exports.up = function (knex) {
    return knex.schema.createTable('beacons', function (table) {
        table.increments('id').primary();
        table.boolean('online').notNullable();
        table.integer('volume').notNullable();
        table.bigInteger('last_seen_ms').notNullable();
        table.decimal('spl_db', 5, 2).notNullable();
        table.decimal('temperature_c', 5, 2).notNullable();
        table.integer('rssi_dbm').notNullable();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('beacons');
};
