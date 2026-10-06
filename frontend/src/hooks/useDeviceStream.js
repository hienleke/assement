import { useEffect, useRef, useState } from "react";
import { messageStreamUrl } from "@/api/message.api.js";
import { STREAM_STATUS } from "@/constants/message.constants.js";
import { safeJsonParse } from "@/utils/json.js";

export function useDeviceStream(deviceId, onMessage) {
  const [status, setStatus] = useState(STREAM_STATUS.IDLE);
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!deviceId) {
      setStatus(STREAM_STATUS.IDLE);
      return undefined;
    }

    setStatus(STREAM_STATUS.CONNECTING);
    const source = new EventSource(messageStreamUrl(deviceId));

    source.addEventListener("ready", (event) => {
      const data = safeJsonParse(event.data);
      setStatus(data?.ok ? STREAM_STATUS.CONNECTED : STREAM_STATUS.DISCONNECTED);
    });

    source.addEventListener("message", (event) => {
      const message = safeJsonParse(event.data);
      if (message) onMessageRef.current(message);
    });

    source.onerror = () => setStatus(STREAM_STATUS.DISCONNECTED);

    return () => {
      console.log("close event source device id: ", deviceId);
      source.close();
    };
  }, [deviceId]);

  return status;
}
