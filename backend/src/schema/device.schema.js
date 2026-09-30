import { z } from "zod";
import { ERRORS } from "@/constants/error.constants.js";

export const deviceIdSchema = z
  .string({ error: ERRORS.INVALID_DEVICE_ID.message })
  .regex(/^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/, ERRORS.INVALID_DEVICE_ID.message);
