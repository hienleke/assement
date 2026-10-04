import { useCallback, useEffect, useRef, useState } from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue.js";
import { useBeacons } from "@/hooks/useBeacons.js";
import { MAX_MESSAGES } from "@/constants/message.constants.js";
import { useMessageStream } from "@/hooks/useMessageStream.js";
import { DEVICE_ID_DEBOUNCE_MS } from "@/constants/monitor.constants.js";
export function useMonitor() {
  const [deviceId, setDeviceId] = useState("");
  const [messages, setMessages] = useState([]);
  const activeDeviceId = useDebouncedValue(deviceId.trim(), DEVICE_ID_DEBOUNCE_MS);
  const messageSeq = useRef(0);

  const { beacons, pagination, setPage, selected, error } = useBeacons(activeDeviceId);

  const pushMessage = useCallback((message) => {
    messageSeq.current += 1;
    const next = { ...message, id: `${message.receivedAt}#${messageSeq.current}` };
    setMessages((current) => [next, ...current].slice(0, MAX_MESSAGES));
  }, []);

  const streamStatus = useMessageStream(activeDeviceId, pushMessage);

  useEffect(() => {
    setMessages([]);
  }, [activeDeviceId]);
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
