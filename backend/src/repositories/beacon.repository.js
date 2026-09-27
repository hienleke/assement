import { db } from "@/db/index.js";

export function listBeacons() {
  return db("beacons").select("*").orderBy("id");
}

export function findBeacon(id) {
  return db("beacons").where({ id }).first();
}

export function insertBeacon(data) {
  return db("beacons").insert(data);
}

export function updateBeacon(id, data) {
  return db("beacons").where({ id }).update(data);
}

export function deleteBeacon(id) {
  return db("beacons").where({ id }).delete();
}
