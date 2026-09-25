import { Router } from "express";
import { z } from "zod";
import { ERRORS } from "@/constants/error.constants.js";
import { createBeacon, deleteBeacon, getBeaconById, listBeacons, setBeaconLed, updateBeacon } from "@/controllers/beacon.controller.js";
import { asyncHandler, validateBody, validateParam } from "@/middlewares/validate.js";

const deviceIdSchema = z
  .string({ error: ERRORS.INVALID_DEVICE_ID.message })
  .regex(/^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/, ERRORS.INVALID_DEVICE_ID.message);

const beaconIdSchema = z.coerce.number().int().positive();

const ledCommandSchema = z.object({
  state: z.enum(["on", "off"], { error: ERRORS.INVALID_LED_STATE.message }),
});

const beaconSchema = z.object({
  online: z.boolean({ error: ERRORS.INVALID_ONLINE.message }),
  volume: z.number({ error: ERRORS.INVALID_VOLUME.message }),
  last_seen_ms: z.number({ error: ERRORS.INVALID_LAST_SEEN_MS.message }),
  spl_db: z.number({ error: ERRORS.INVALID_SPL_DB.message }),
  temperature_c: z.number({ error: ERRORS.INVALID_TEMPERATURE_C.message }),
  rssi_dbm: z.number({ error: ERRORS.INVALID_RSSI_DBM.message }),
});

export const beaconRouter = Router();

beaconRouter.get("/", asyncHandler(listBeacons));
beaconRouter.get(
  "/:id",
  validateParam("id", beaconIdSchema, ERRORS.INVALID_BEACON_ID.message),
  asyncHandler(getBeaconById),
);
beaconRouter.post(
  "/:id/led",
  validateParam("id", deviceIdSchema),
  validateBody(ledCommandSchema),
  setBeaconLed,
);

beaconRouter.post("/", createBeacon);
beaconRouter.put("/:id", validateParam("id", beaconIdSchema), validateBody(beaconSchema), updateBeacon);
beaconRouter.delete("/:id", validateParam("id", beaconIdSchema), deleteBeacon);