import cors from "cors";
import express from "express";
import { beaconRouter } from "./routes/beacon.routes.js";
import { messageRouter } from "./routes/message.routes.js";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use(cors());
  app.use(express.json());
  app.use("/beacons", beaconRouter);
  app.use("/messages", messageRouter);

  app.use((_req, res) => {
    res.status(404).json({ error: "not found" });
  });

  app.use((err, _req, res, _next) => {
    console.error(`[http] ${err.message}`);
    res.status(500).json({ error: "internal server error" });
  });

  return app;
}
