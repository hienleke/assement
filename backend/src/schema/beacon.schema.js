import { z } from "zod";
import { ERRORS } from "@/constants/error.constants.js";

export const beaconIdSchema = z.coerce.number().int().positive();

export const ledCommandSchema = z.object({
  state: z.enum(["on", "off"], { error: ERRORS.INVALID_LED_STATE.message }),
});

export const beaconSchema = z.object({
  online: z.boolean({ error: ERRORS.INVALID_ONLINE.message }),
  volume: z.number({ error: ERRORS.INVALID_VOLUME.message }),
  last_seen_ms: z.number({ error: ERRORS.INVALID_LAST_SEEN_MS.message }),
  spl_db: z.number({ error: ERRORS.INVALID_SPL_DB.message }),
  temperature_c: z.number({ error: ERRORS.INVALID_TEMPERATURE_C.message }),
  rssi_dbm: z.number({ error: ERRORS.INVALID_RSSI_DBM.message }),
});
