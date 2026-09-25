import { Router } from "express";
import { z } from "zod";
import { ERRORS } from "@/constants/error.constants.js";
import { getBeaconById, listBeacons, setBeaconLed } from "@/controllers/beacon.controller.js";
import { asyncHandler, validateBody, validateParam } from "@/middlewares/validate.js";

const deviceIdSchema = z
  .string({ error: ERRORS.INVALID_DEVICE_ID.message })
  .regex(/^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/, ERRORS.INVALID_DEVICE_ID.message);

const beaconIdSchema = z.coerce.number().int().positive();

const ledCommandSchema = z.object({
  state: z.enum(["on", "off"], { error: ERRORS.INVALID_LED_STATE.message }),
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
