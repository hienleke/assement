import { useState } from "react";
import { MessageList } from "@/components/MessageList/MessageList.jsx";
import { useMonitor } from "@/hooks/useMonitor.js";
import { setBeaconLed } from "@/services/api.js";
import styles from "./MonitorPage.module.scss";
import { BeaconDetail } from "./BeaconDetail.jsx";
export function MonitorPage() {
  const {
    deviceId,
    setDeviceId,
    activeDeviceId,
    beacons,
    selected,
    error,
    messages,
    pendingCount,
    streamStatus,
  } = useMonitor();

  const [pending, setPending] = useState(false);
  const [command, setCommand] = useState(null);

  const sendLed = async (state) => {
    setPending(true);
    setCommand(null);
    try {
      const result = await setBeaconLed(activeDeviceId, state);
      setCommand({ ok: true, text: `Published ${result.payload.state} to ${result.topic}` });
    } catch (err) {
      setCommand({ ok: false, text: err.message });
    } finally {
      setPending(false);
    }
  };

  const canSend = !pending && activeDeviceId !== "";

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Assessment</p>
        <h1 className={styles.title}>Beacon dashboard</h1>
        {error ? <p className={styles.error}>{error}</p> : null}
      </header>

      <section className={styles.layout}>
        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Beacons</h2>
            <span>{beacons.length}</span>
          </div>
          {beacons.length === 0 ? (
            <p className={styles.empty}>No beacons yet.</p>
          ) : (
            <ul className={styles.beaconList}>
              {beacons.map((beacon) => {
                const id = String(beacon.id);
                return (
                  <li key={id}>
                    <button
                      type="button"
                      className={id === deviceId ? styles.beaconActive : styles.beacon}
                      onClick={() => setDeviceId(id)}
                    >
                      <strong>#{id}</strong>
                      <span>{beacon.online ? "online" : "offline"}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          {selected && <BeaconDetail beacon={selected} />}
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>LED command</h2>
            <span className={styles.stream}>{streamStatus}</span>
          </div>
          <p className={styles.hint}>Send command to device id: {activeDeviceId}</p>
          <label className={styles.field}>
            Device id
            <input value={deviceId} onChange={(event) => setDeviceId(event.target.value)} />
          </label>
          <div className={styles.actions}>
            <button type="button" disabled={!canSend} onClick={() => sendLed("on")}>
              Turn on
            </button>
            <button
              type="button"
              className={styles.off}
              disabled={!canSend}
              onClick={() => sendLed("off")}
            >
              Turn off
            </button>
          </div>
          {command ? <p className={command.ok ? styles.ok : styles.error}>{command.text}</p> : null}
        </section>
      </section>

      <MessageList messages={messages} pendingCount={pendingCount} />
    </main>
  );
}
