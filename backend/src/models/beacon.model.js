import { db } from "../db/index.js";

export function getBeacons() {
  return db("beacons").select("*").orderBy("id");
}

export function getBeacon(id) {
  return db("beacons").where({ id }).first();
}
