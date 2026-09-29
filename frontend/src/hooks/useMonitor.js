import { useEffect, useRef, useState } from "react";
import {
  DEVICE_ID_DEBOUNCE_MS,
  FLUSH_INTERVAL_MS,
  MAX_MESSAGES,
} from "@/constants/monitor.constants.js";
import { useBeacons } from "./useBeacons.js";
import { useDebouncedValue } from "./useDebouncedValue.js";
import { useMessageBuffer } from "./useMessageBuffer.js";
import { useMessageStream } from "./useMessageStream.js";


export function useMonitor() {
  const [deviceId, setDeviceId] = useState("");
  const activeDeviceId = useDebouncedValue(deviceId.trim(), DEVICE_ID_DEBOUNCE_MS);

  const { beacons, selected, error } = useBeacons(activeDeviceId);
  const { messages, pendingCount, push, clear } = useMessageBuffer({
    limit: MAX_MESSAGES,
    flushIntervalMs: FLUSH_INTERVAL_MS,
  });
  const streamStatus = useMessageStream(activeDeviceId, push);

  useEffect(() => {
    clear();
  }, [activeDeviceId, clear]);
  const autoSelected = useRef(false);
  useEffect(() => {
    if (autoSelected.current || beacons.length === 0) return;
    autoSelected.current = true;
    setDeviceId((current) => (current === "" ? String(beacons[0].id) : current));
  }, [beacons]);

  return {
    deviceId,
    setDeviceId,
    activeDeviceId,
    beacons,
    selected,
    error,
    messages,
    pendingCount,
    streamStatus,
  };
}
