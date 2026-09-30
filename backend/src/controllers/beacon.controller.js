
import { create, findById, list, remove, setLed, update } from "@/services/beacon.service.js";

export async function listBeacons(_req, res) {
  res.json(await list());
}

export async function getBeaconById(req, res) {
  const beacon = await findById(req.validated.id);
  res.json(beacon);
}

export async function deleteBeacon(req, res) {
  const deleted = await remove(req.validated.id);
  res.json(deleted);
}

export async function createBeacon(req, res) {
  const created = await create(req.body);
  res.json(created);
}

export async function updateBeacon(req, res) {
  const updated = await update(req.validated.id, req.body);
  res.json(updated);
}

export async function setBeaconLed(req, res) {
  const result = await setLed(req.validated.id, req.body);
  res.json(result);
}
