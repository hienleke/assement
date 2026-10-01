import { apiPath } from "@/common/api/client.js";

export function messageStreamUrl(deviceId) {
  return apiPath(`/messages/stream?deviceId=${encodeURIComponent(deviceId)}`);
}
