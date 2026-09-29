export const SERIES = [
    { key: "volume", label: "Volume", color: "#1f4b3a" },
    { key: "spl_db", label: "SPL dB", color: "#2f7d55" },
    { key: "temperature_c", label: "Temperature °C", color: "#c47b2b" },
    { key: "rssi_dbm", label: "RSSI dBm", color: "#9d342c" },
  ];
  
  export const CHART_OPTIONS = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: { legend: { position: "bottom" } },
    scales: {
      x: { ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 6 } },
    },
  };