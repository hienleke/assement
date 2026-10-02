import { useEffect, useRef, useState } from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue.js";
import { useBeacons } from "@/hooks/useBeacons.js";
import { MAX_MESSAGES } from "@/constants/message.constants.js";
import { useMessageBuffer } from "@/hooks/useMessageBuffer.js";
import { useMessageStream } from "@/hooks/useMessageStream.js";
import { DEVICE_ID_DEBOUNCE_MS } from "@/constants/monitor.constants.js";

export function useMonitor() {
  const [deviceId, setDeviceId] = useState("");
  const activeDeviceId = useDebouncedValue(deviceId.trim(), DEVICE_ID_DEBOUNCE_MS);

  const { beacons, pagination, setPage, selected, error } = useBeacons(activeDeviceId);
  const { messages, push, clear } = useMessageBuffer({ limit: MAX_MESSAGES });

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
    pagination,
    setPage,
    selected,
    error,
    messages,
    streamStatus,
  };
}
