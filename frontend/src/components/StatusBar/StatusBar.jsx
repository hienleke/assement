import styles from "./StatusBar.module.scss";

function Pill({ label, value, tone }) {
  return (
    <div className={styles.pill}>
      <span className={styles.label}>{label}</span>
      <span className={tone ? styles[tone] : styles.value}>{value}</span>
    </div>
  );
}

export function StatusBar({ health, error }) {
  if (error) {
    return (
      <section className={styles.bar}>
        <Pill label="API" value="offline" tone="bad" />
      </section>
    );
  }

  const mqttConnected = Boolean(health?.mqtt?.connected);

  return (
    <section className={styles.bar}>
      <Pill label="Database" value={health?.database ?? "unknown"} tone={health?.database === "up" ? "ok" : "bad"} />
      <Pill label="MQTT" value={mqttConnected ? "connected" : "disconnected"} tone={mqttConnected ? "ok" : "bad"} />
      <Pill label="Topic" value={health?.mqtt?.topic ?? "—"} />
    </section>
  );
}
