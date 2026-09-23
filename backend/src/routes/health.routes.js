import { Router } from "express";
import { db } from "../db/index.js";
import { mqttStatus } from "../mqtt/client.js";

export const healthRouter = Router();

healthRouter.get("/", async (_req, res, next) => {
  try {
    await db.raw("select 1");
    res.json({ ok: true, database: "up", mqtt: mqttStatus() });
  } catch (err) {
    next(err);
  }
});
