import { Router } from "express";
import { streamMessages } from "@/controllers/message.controller.js";
import { validateQuery } from "@/middlewares/validate.js";
import { ERRORS } from "@/constants/error.constants.js";
import { z } from "zod";

const deviceIdSchema = z
    .string({ error: ERRORS.INVALID_DEVICE_ID.message })
    .regex(/^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/, ERRORS.INVALID_DEVICE_ID.message);

export const messageRouter = Router();

messageRouter.get("/stream", validateQuery("deviceId", deviceIdSchema, ERRORS.INVALID_DEVICE_ID.message), streamMessages);