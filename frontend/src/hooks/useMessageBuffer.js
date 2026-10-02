import { useCallback, useRef, useState } from "react";

export function useMessageBuffer({ limit }) {
  const seqRef = useRef(0);
  const [messages, setMessages] = useState([]);

  const push = useCallback(
    (message) => {
      seqRef.current += 1;
      const next = { ...message, id: `${message.receivedAt}#${seqRef.current}` };
      setMessages((current) => [next, ...current].slice(0, limit));
    },
    [limit],
  );

  const clear = useCallback(() => {
    setMessages([]);
  }, []);

  return { messages, push, clear };
}
