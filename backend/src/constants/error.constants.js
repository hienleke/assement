export const ERRORS = {
  INVALID_REQUEST: { status: 400, message: "invalid request" },
  DEVICE_ID_REQUIRED: { status: 400, message: "device id is required" },
  INVALID_DEVICE_ID: { status: 400, message: "invalid device id" },
  INVALID_BEACON_ID: { status: 400, message: "invalid beacon id" },
  INVALID_LED_STATE: { status: 400, message: 'state must be "on" or "off"' },
  BEACON_NOT_FOUND: { status: 404, message: "beacon not found" },
  NOT_FOUND: { status: 404, message: "not found" },
  MQTT_PUBLISH_FAILED: { status: 502, message: "mqtt publish failed" },
  MQTT_NOT_CONNECTED: { status: 503, message: "mqtt not connected" },
  INTERNAL: { status: 500, message: "internal server error" },
};
