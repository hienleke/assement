import { Router } from "express";
import { z } from "zod";
import { getBeaconById, listBeacons, setBeaconLed } from "@/controllers/beacon.controller.js";
import { asyncHandler, validateBody, validateParam } from "@/middlewares/validate.js";

const deviceIdSchema = z
  .string({ error: "invalid device id" })
  .regex(/^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/, "invalid device id");

const beaconIdSchema = z.coerce.number().int().positive();

const ledCommandSchema = z.object({
  state: z.enum(["on", "off"], { error: 'state must be "on" or "off"' }),
});

export const beaconRouter = Router();

beaconRouter.get("/", asyncHandler(listBeacons));
beaconRouter.get(
  "/:id",
  validateParam("id", beaconIdSchema, "invalid beacon id"),
  asyncHandler(getBeaconById),
);
beaconRouter.post(
  "/:id/led",
  validateParam("id", deviceIdSchema),
  validateBody(ledCommandSchema),
  setBeaconLed,
);
