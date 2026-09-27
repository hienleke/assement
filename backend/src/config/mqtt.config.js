import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { optional, required } from "@/utils/helper.js";

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

dotenv.config({ path: path.join(backendRoot, ".env") });

const certificate = optional("MQTT_CERTIFICATE") ?? "cert/emqxsl-ca.crt";

export const mqttConfig = {
  url: required("MQTT_URL", "mqtt://localhost:1883"),
  username: optional("MQTT_USERNAME"),
  password: optional("MQTT_PASSWORD"),
  certificate: path.resolve(backendRoot, certificate),
  clientId: required("MQTT_CLIENT_ID", `assessment-backend-${process.pid}`),
  baseTopic: "zena",
  qos: Number(required("MQTT_QOS", "1")),
};
