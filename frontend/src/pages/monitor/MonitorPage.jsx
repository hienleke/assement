import { useState } from "react";
import { MessageList } from "@/components/MessageList/MessageList.jsx";
import { useMonitor } from "@/hooks/useMonitor.js";
import { setBeaconLed } from "@/services/api.js";
import styles from "./MonitorPage.module.scss";

export function MonitorPage() {
  const [deviceId, setDeviceId] = useState('');
  const { beacons, selected, error, messages, streamStatus } = useMonitor(trimmedDeviceId);
  const [pending, setPending] = useState(false);
  const [command, setCommand] = useState(null);

  const sendLed = async (state) => {
    setPending(true);
    setCommand(null);
    try {
      const result = await setBeaconLed(trimmedDeviceId, state);
      setCommand({ ok: true, text: `Published ${result.payload.state} to ${result.topic}` });
    } catch (err) {
      setCommand({ ok: false, text: err.message });
    } finally {
      setPending(false);
    }
  }

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
              {beacons.map((beacon) => (
                <li key={beacon.id}>
                  <button
                    type="button"
                    className={beacon.id === deviceId ? styles.beaconActive : styles.beacon}
                    onClick={() => setDeviceId(beacon.id)}
                  >
                    <strong>#{beacon.id}</strong>
                    <span>{beacon.online ? "online" : "offline"}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {selected ? (
            <dl className={styles.detail}>
              <div>
                <dt>Volume</dt>
                <dd>{selected.volume}</dd>
              </div>
              <div>
                <dt>SPL</dt>
                <dd>{selected.spl_db} dB</dd>
              </div>
              <div>
                <dt>Temperature</dt>
                <dd>{selected.temperature_c} °C</dd>
              </div>
              <div>
                <dt>RSSI</dt>
                <dd>{selected.rssi_dbm} dBm</dd>
              </div>
            </dl>
          ) : null}
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>LED command</h2>
            <span className={styles.stream}>{streamStatus}</span>
          </div>
          <p className={styles.hint}>Command zena/{trimmedDeviceId || ":id"}/cmd · data zena/{trimmedDeviceId || ":id"}/data</p>
          <label className={styles.field}>
            Device id
            <input value={deviceId} onChange={(event) => {
              console.log(deviceId);
              setDeviceId(event.target.value)
            }} />
          </label>
          <div className={styles.actions}>
            <button type="button" disabled={pending || trimmedDeviceId === ""} onClick={() => sendLed("on")}>
              Turn on
            </button>
            <button type="button" className={styles.off} disabled={pending || trimmedDeviceId === ""} onClick={() => sendLed("off")}>
              Turn off
            </button>
          </div>
          {command ? <p className={command.ok ? styles.ok : styles.error}>{command.text}</p> : null}
        </section>
      </section>

      <MessageList messages={messages} />
    </main>
  );
}
