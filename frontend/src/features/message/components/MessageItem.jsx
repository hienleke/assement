import { memo } from "react";
import { formatPayload, formatTime } from "@/features/message/util/format.js";
import styles from "./MessageList.module.scss";

export const MessageItem = memo(function MessageItem({ message }) {
  return (
    <article className={styles.item}>
      <div className={styles.meta}>
        <span className={styles.topic}>{message.topic}</span>
        <time dateTime={message.receivedAt}>{formatTime(message.receivedAt)}</time>
      </div>
      <pre className={styles.payload}>{formatPayload(message.payload)}</pre>
    </article>
  );
});
