import { db } from "@/db/index.js";

export async function listBeacons(page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  const [data, counted] = await Promise.all([
    db("beacons").select("*").orderBy("id").offset(offset).limit(limit),
    db("beacons").count({ total: "*" }).first(),
  ]);

  return { data, total: Number(counted?.total ?? 0) };
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
