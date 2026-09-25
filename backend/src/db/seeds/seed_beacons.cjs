/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
exports.seed = async function (knex) {
  await knex("beacons").del();

  await knex("beacons").insert([
    {
      id: 1,
      online: true,
      volume: 42,
      last_seen_ms: 1000,
      spl_db: 38.5,
      temperature_c: 32.1,
      rssi_dbm: -48,
    },
    {
      id: 2,
      online: true,
      volume: 67,
      last_seen_ms: 1450,
      spl_db: 52.3,
      temperature_c: 28.7,
      rssi_dbm: -62,
    },
    {
      id: 3,
      online: false,
      volume: 15,
      last_seen_ms: 8920,
      spl_db: 29.8,
      temperature_c: 35.4,
      rssi_dbm: -81,
    },
  ]);
};
