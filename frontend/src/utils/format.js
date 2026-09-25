export function formatPayload(payload) {
  if (typeof payload === "string") return payload;
  return JSON.stringify(payload, null, 2);
}

export function formatTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
