import { apiPath } from "@/lib/http.js";

export function messageStreamUrl(deviceId) {
  return apiPath(`/messages/stream?deviceId=${encodeURIComponent(deviceId)}`);
}
