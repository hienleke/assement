import { memo, useMemo } from "react";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { formatPayload, formatTime } from "@/utils/format.js";
import styles from "./MessageList.module.scss";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const SERIES = [
  { key: "volume", label: "Volume", color: "#1f4b3a" },
  { key: "spl_db", label: "SPL dB", color: "#2f7d55" },
  { key: "temperature_c", label: "Temperature °C", color: "#c47b2b" },
  { key: "rssi_dbm", label: "RSSI dBm", color: "#9d342c" },
];

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  plugins: { legend: { position: "bottom" } },
  scales: {
    x: { ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 6 } },
  },
};

function chartRows(messages) {
  return [...messages].reverse().filter((message) => message.payload && typeof message.payload === "object");
}

const MessageItem = memo(function MessageItem({ message }) {
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

export const MessageList = memo(function MessageList({ messages }) {
  const rows = useMemo(() => chartRows(messages), [messages]);
  const chartData = useMemo(
    () => ({
      labels: rows.map((message) => formatTime(message.receivedAt)),
      datasets: SERIES.map((series) => ({
        label: series.label,
        data: rows.map((message) => Number(message.payload[series.key])),
        borderColor: series.color,
        backgroundColor: series.color,
        tension: 0.25,
        pointRadius: 3,
      })),
    }),
    [rows],
  );

  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.title}>Live messages</h2>
        <span className={styles.count}>{messages.length} received</span>
      </div>
      {rows.length > 0 ? (
        <div className={styles.chart}>
          <Line data={chartData} options={chartOptions} />
        </div>
      ) : null}
      { messages.length === 0 && (
        <p className={styles.empty}>Waiting for MQTT messages on the stream.</p>
      ) }
    </section>
  );
});
