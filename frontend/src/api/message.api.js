import { apiPath } from "@/api/client.js";

export function messageStreamUrl(deviceId) {
  return apiPath(`/messages/stream?deviceId=${encodeURIComponent(deviceId)}`);
}
