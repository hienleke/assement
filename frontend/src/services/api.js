export const apiUrl = (import.meta.env.VITE_API_URL ?? "http://localhost:3000").replace(/\/$/, "");

function apiPath(path) {
  return `${apiUrl}${path}`;
}

async function readJson(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `${response.status} ${response.statusText}`);
  }
  return data;
}

export function fetchBeacons() {
  return fetch(apiPath("/beacons")).then(readJson);
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

export function messageStreamUrl(deviceId) {
  return apiPath(`/messages/stream?deviceId=${encodeURIComponent(deviceId)}`);
}
