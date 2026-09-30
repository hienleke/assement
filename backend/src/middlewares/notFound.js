import { ERRORS } from "@/constants/error.constants.js";


export function notFound(_req, res) {
  res.status(ERRORS.NOT_FOUND.status).json({ error: ERRORS.NOT_FOUND.message });
}