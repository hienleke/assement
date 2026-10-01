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
import { CHART_OPTIONS, SERIES } from "@/features/message/constants/message.constants.js";
import { formatTime } from "@/features/message/util/format.js";
import styles from "./MessageList.module.scss";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export const MessageChart = memo(function MessageChart({ messages }) {
  const rows = useMemo(
    () =>
      messages
        .filter((message) => message.payload && typeof message.payload === "object")
        .reverse(),
    [messages],
  );

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

  if (rows.length === 0) return null;

  return (
    <div className={styles.chart}>
      <Line data={chartData} options={CHART_OPTIONS} />
    </div>
  );
});
