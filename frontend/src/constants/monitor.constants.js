/** Số message tối đa giữ lại để hiển thị. */
export const MAX_MESSAGES = 20;

/** Chu kỳ đẩy message từ cache ra UI (ms). */
export const FLUSH_INTERVAL_MS = 1000;

/** Chờ người dùng gõ xong device id rồi mới mở lại stream (ms). */
export const DEVICE_ID_DEBOUNCE_MS = 400;

export const STREAM_STATUS = {
  IDLE: "waiting for device",
  CONNECTING: "connecting",
  CONNECTED: "connected",
  DISCONNECTED: "disconnected",
};
