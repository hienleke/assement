import { ERRORS } from "@/constants/error.constants.js";

export function notFound(_req, res) {
  res.status(ERRORS.NOT_FOUND.status).json({ error: ERRORS.NOT_FOUND.message });
}

export function errorHandler(err, _req, res, _next) {
  console.error(`[http] ${err.message}`);
  res.status(ERRORS.INTERNAL.status).json({ error: ERRORS.INTERNAL.message });
}
