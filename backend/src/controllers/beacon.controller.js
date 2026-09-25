import { ERRORS } from "@/constants/error.constants.js";
import { publishMqtt } from "@/mqtt/mqtt.js";
import { getBeacon, getBeacons } from "@/models/beacon.model.js";

export async function listBeacons(_req, res) {
  res.json(await getBeacons());
}

export async function getBeaconById(req, res) {
  const beacon = await getBeacon(req.validated.id);
  if (!beacon) {
    res.status(ERRORS.BEACON_NOT_FOUND.status).json({ error: ERRORS.BEACON_NOT_FOUND.message });
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
    res.status(err.status || ERRORS.MQTT_PUBLISH_FAILED.status).json({ error: err.message, topic });
  }
}
