export const MAX_MESSAGES = 20;

export const FLUSH_INTERVAL_MS = 1000;

export const DEVICE_ID_DEBOUNCE_MS = 400;

export const STREAM_STATUS = {
  IDLE: "waiting for device",
  CONNECTING: "connecting",
  CONNECTED: "connected",
  DISCONNECTED: "disconnected",
};

export const DETAIL_FIELDS = [
  { key: "volume", label: "Volume" },
  { key: "spl_db", label: "SPL", unit: " dB" },
  { key: "temperature_c", label: "Temperature", unit: " °C" },
  { key: "rssi_dbm", label: "RSSI", unit: " dBm" },
];
