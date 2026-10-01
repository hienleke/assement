import { useEffect, useRef, useState } from "react";
import { useDebouncedValue } from "@/common/hooks/useDebouncedValue.js";
import { useBeacons } from "@/features/beacon/hooks/useBeacons.js";
import { FLUSH_INTERVAL_MS, MAX_MESSAGES } from "@/features/message/constants/message.constants.js";
import { useMessageBuffer } from "@/features/message/hooks/useMessageBuffer.js";
import { useMessageStream } from "@/features/message/hooks/useMessageStream.js";
import { DEVICE_ID_DEBOUNCE_MS } from "@/features/monitor/constants/monitor.constants.js";

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
