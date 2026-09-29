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
import { formatTime } from "@/utils/format.js";
import { SERIES, CHART_OPTIONS } from "./message.constants";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export const MessageChart = memo(function MessageChart({ messages }) {
  const rows = useMemo(() => {
    return messages
      .filter((msg) => msg.payload && typeof msg.payload === "object")
      .reverse();
  }, [messages]);

  const chartData = useMemo(
    () => ({
      labels: rows.map((msg) => formatTime(msg.receivedAt)),
      datasets: SERIES.map((series) => ({
        label: series.label,
        data: rows.map((msg) => Number(msg.payload[series.key])),
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
    <div className="chart-container">
      <Line data={chartData} options={CHART_OPTIONS} />
    </div>
  );
});