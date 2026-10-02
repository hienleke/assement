import { memo } from "react";
import { MessageChart } from "./MessageChart.jsx";
import styles from "./MessageList.module.scss";

export const MessageList = memo(function MessageList({ className, messages }) {
  return (
    <section className={className ? `${styles.panel} ${className}` : styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.title}>Live messages</h2>
        <span className={styles.count}>{messages.length} received</span>
      </div>

      <MessageChart messages={messages} />
    </section>
  );
});
