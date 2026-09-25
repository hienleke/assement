import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

dotenv.config({ path: path.join(backendRoot, ".env") });

function required(name, fallback) {
  const value = process.env[name];
  if (value === undefined || value === "") return fallback;
  return value;
}

function optional(name) {
  const value = process.env[name];
  if (value === undefined || value === "") return undefined;
  return value;
}

const certificate = optional("MQTT_CERTIFICATE") ?? "cert/emqxsl-ca.crt";

export const config = {
  port: Number(required("PORT", "3000")),
  databaseUrl: required("DATABASE_URL", "postgres://postgres:postgres@localhost:5432/assessment"),
  mqtt: {
    url: required("MQTT_URL", "mqtt://localhost:1883"),
    username: optional("MQTT_USERNAME"),
    password: optional("MQTT_PASSWORD"),
    certificate: path.resolve(backendRoot, certificate),
    clientId: required("MQTT_CLIENT_ID", `assessment-backend-${process.pid}`),
    topic: required("MQTT_TOPIC", "zena"),
    qos: Number(required("MQTT_QOS", "1")),
  },
};
