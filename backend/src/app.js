import cors from "cors";
import express from "express";
import { errorHandler, notFound } from "@/middlewares/error.js";
import { beaconRouter } from "@/routes/beacon.routes.js";
import { messageRouter } from "@/routes/message.routes.js";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use(cors());
  app.use(express.json());
  app.use("/beacons", beaconRouter);
  app.use("/messages", messageRouter);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
