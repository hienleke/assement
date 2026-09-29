import { memo } from "react";
import { MessageChart } from "./MessageChart.jsx";
import { MessageItem } from "./MessageItem.jsx";
import styles from "./MessageList.module.scss";

export const MessageList = memo(function MessageList({ messages, pendingCount = 0 }) {
  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.title}>Live messages</h2>
        <span className={styles.count}>
          {messages.length} received
          {pendingCount > 0 ? ` · ${pendingCount} buffered` : ""}
        </span>
      </div>

      <MessageChart messages={messages} />

      {messages.length === 0 ? (
        <p className={styles.empty}>Waiting for MQTT messages on the stream.</p>
      ) : (
        <div className={styles.list}>
          {messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
        </div>
      )}
    </section>
  );
});
