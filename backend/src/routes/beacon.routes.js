import { Router } from "express";
import { ERRORS } from "@/constants/error.constants.js";
import {
  createBeacon,
  deleteBeacon,
  getBeaconById,
  listBeacons,
  sendCommand,
  updateBeacon,
} from "@/controllers/beacon.controller.js";
import { asyncHandler, validateBody, validateParam } from "@/middlewares/validate.js";
import { beaconIdSchema, beaconSchema, commandSchema } from "@/schema/beacon.schema.js";
import { deviceIdSchema } from "@/schema/device.schema.js";

export const beaconRouter = Router();

beaconRouter.get("/", asyncHandler(listBeacons));
beaconRouter.get(
  "/:id",
  validateParam("id", beaconIdSchema, ERRORS.INVALID_BEACON_ID.message),
  asyncHandler(getBeaconById),
);
beaconRouter.post(
  "/:id/command",
  validateParam("id", deviceIdSchema),
  validateBody(commandSchema),
  asyncHandler(sendCommand),
);

beaconRouter.post("/", createBeacon);
beaconRouter.put(
  "/:id",
  validateParam("id", beaconIdSchema),
  validateBody(beaconSchema),
  asyncHandler(updateBeacon),
);
beaconRouter.delete("/:id", validateParam("id", beaconIdSchema), asyncHandler(deleteBeacon));
