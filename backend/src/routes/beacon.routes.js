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
import { asyncHandler, validateBody, validateParam, validateQuery } from "@/middlewares/validate.js";
import { beaconIdSchema, beaconSchema, commandSchema, beaconListQuerySchema } from "@/schema/beacon.schema.js";
import { deviceIdSchema } from "@/schema/device.schema.js";

export const beaconRouter = Router();

beaconRouter.get("/", validateQuery("page", beaconListQuerySchema.shape.page, ERRORS.INVALID_PAGE.message), validateQuery("limit", beaconListQuerySchema.shape.limit, ERRORS.INVALID_LIMIT.message), asyncHandler(listBeacons));
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

beaconRouter.post("/", validateBody(beaconSchema), asyncHandler(createBeacon));
beaconRouter.put(
  "/:id",
  validateParam("id", beaconIdSchema),
  validateBody(beaconSchema),
  asyncHandler(updateBeacon),
);
beaconRouter.delete("/:id", validateParam("id", beaconIdSchema), asyncHandler(deleteBeacon));
