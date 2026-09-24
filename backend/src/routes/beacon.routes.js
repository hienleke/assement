import { Router } from "express";
import { z } from "zod";
import { publishMqtt } from "../mqtt/client.js";

const deviceIdSchema = z
  .string({ error: "invalid device id" })
  .regex(/^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/, "invalid device id");

const ledCommandSchema = z.object({
  state: z.enum(["on", "off"], { error: 'state must be "on" or "off"' }),
});

export const beaconRouter = Router();

beaconRouter.post("/:id/led", async (req, res) => {
  const deviceIdResult = deviceIdSchema.safeParse(req.params.id);
  if (!deviceIdResult.success) {
    res.status(400).json({ error: deviceIdResult.error.issues[0]?.message || "invalid device id" });
    return;
  }

  const commandResult = ledCommandSchema.safeParse(req.body ?? {});
  if (!commandResult.success) {
    res.status(400).json({ error: commandResult.error.issues[0]?.message || "invalid request" });
    return;
  }

  const topic = `zena/${deviceIdResult.data}/cmd`;
  const payload = commandResult.data;

  try {
    await publishMqtt(topic, payload);
    res.json({ ok: true, topic, payload });
  } catch (err) {
    res.status(err.status || 502).json({ error: err.message, topic });
  }
});

beaconRouter.get("/", async (req, res) => {
  const beacons = await getBeacons();
  res.json(beacons);
});

beaconRouter.get("/:id", async (req, res) => {
  const beacon = await getBeacon(req.params.id);
  res.json(beacon);
});