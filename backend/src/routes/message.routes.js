import { Router } from "express";
import { ERRORS } from "@/constants/error.constants.js";
import { streamMessages } from "@/controllers/message.controller.js";
import { validateQuery } from "@/middlewares/validate.js";
import { deviceIdSchema } from "@/schema/device.schema.js";

export const messageRouter = Router();

messageRouter.get(
  "/stream",
  validateQuery("deviceId", deviceIdSchema, ERRORS.INVALID_DEVICE_ID.message),
  streamMessages,
);
