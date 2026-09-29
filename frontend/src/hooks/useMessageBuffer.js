import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Cache message đến trong một ref (không re-render), rồi cứ mỗi
 * `flushIntervalMs` mới đẩy cả lô ra state để UI vẽ lại một lần.
 *
 * Nhờ vậy tần suất render không phụ thuộc tần suất message MQTT.
 */
export function useMessageBuffer({ limit, flushIntervalMs }) {
  const bufferRef = useRef([]);
  const seqRef = useRef(0);
  const [messages, setMessages] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);

  const push = useCallback(
    (message) => {
      seqRef.current += 1;
      const cached = { ...message, id: `${message.receivedAt}#${seqRef.current}` };
      bufferRef.current = [cached, ...bufferRef.current].slice(0, limit);
      setPendingCount(bufferRef.current.length);
    },
    [limit],
  );

  const clear = useCallback(() => {
    bufferRef.current = [];
    setPendingCount(0);
    setMessages([]);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (bufferRef.current.length === 0) return;
      const batch = bufferRef.current;
      bufferRef.current = [];
      setPendingCount(0);
      setMessages((current) => [...batch, ...current].slice(0, limit));
    }, flushIntervalMs);

    return () => clearInterval(timer);
  }, [flushIntervalMs, limit]);

  return { messages, pendingCount, push, clear };
}
