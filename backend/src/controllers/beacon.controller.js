import { publishMqtt } from "../mqtt/client.js";
import { getBeacon, getBeacons } from "../models/beacon.model.js";

export async function listBeacons(_req, res) {
  res.json(await getBeacons());
}

export async function getBeaconById(req, res) {
  const beacon = await getBeacon(req.validated.id);
  if (!beacon) {
    res.status(404).json({ error: "beacon not found" });
    return;
  }
  res.json(beacon);
}

export async function setBeaconLed(req, res) {
  const topic = `zena/${req.validated.id}/cmd`;
  const payload = req.body;

  try {
    await publishMqtt(topic, payload);
    res.json({ ok: true, topic, payload });
  } catch (err) {
    res.status(err.status || 502).json({ error: err.message, topic });
  }
}
