import { ERRORS } from "@/constants/error.constants.js";
import { create, findById, list, remove, setLed, update } from "@/services/beacon.service.js";

export async function listBeacons(_req, res) {
  res.json(await list());
}

export async function getBeaconById(req, res) {
  const beacon = await findById(req.validated.id);
  if (!beacon) {
    res.status(ERRORS.BEACON_NOT_FOUND.status).json({ error: ERRORS.BEACON_NOT_FOUND.message });
    return;
  }
  res.json(beacon);
}

export async function deleteBeacon(req, res) {
  const deleted = await remove(req.validated.id);
  if (!deleted) {
    res.status(ERRORS.BEACON_NOT_FOUND.status).json({ error: ERRORS.BEACON_NOT_FOUND.message });
    return;
  }
  res.json(deleted);
}

export async function createBeacon(req, res) {
  res.json(await create(req.body));
}

export async function updateBeacon(req, res) {
  const updated = await update(req.validated.id, req.body);
  if (!updated) {
    res.status(ERRORS.BEACON_NOT_FOUND.status).json({ error: ERRORS.BEACON_NOT_FOUND.message });
    return;
  }
  res.json(updated);
}

export async function setBeaconLed(req, res) {
  try {
    res.json(await setLed(req.validated.id, req.body));
  } catch (err) {
    res.status(err.status || ERRORS.MQTT_PUBLISH_FAILED.status).json({
      error: err.message,
      topic: err.topic,
    });
  }
}
