import { apiPath, readJson } from "@/common/api/client.js";

export function fetchBeacons(page = 1, limit = 10) {
  return fetch(apiPath(`/beacons?page=${page}&limit=${limit}`)).then(readJson);
}

export function fetchBeacon(id) {
  return fetch(apiPath(`/beacons/${encodeURIComponent(id)}`)).then(readJson);
}

export function sendCommandToDevice(deviceId, command) {
  return fetch(apiPath(`/beacons/${encodeURIComponent(deviceId)}/command`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(command),
  }).then(readJson);
}
