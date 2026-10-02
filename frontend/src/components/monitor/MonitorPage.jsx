import { MessageList } from "@/components/message/MessageList.jsx";
import { Tile } from "@/components/beacon/Tile.jsx";
import { useMonitor } from "@/hooks/useMonitor.js";
import styles from "./MonitorPage.module.scss";

export function MonitorPage() {
  const { deviceId, setDeviceId, beacons, pagination, setPage, error, messages, streamStatus } =
    useMonitor();

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Assessment</p>
        <h1 className={styles.title}>Beacon dashboard</h1>
        {error ? <p className={styles.error}>{error}</p> : null}
      </header>
      <div className={styles.container}>
      <section className={styles.beacons}>
        <div className={styles.panelHeader}>
          <h2>Beacons</h2>
          <span className={styles.stream}>{streamStatus}</span>
        </div>
        {beacons.length === 0 ? (
          <p className={styles.empty}>No beacons yet.</p>
        ) : (
          <ul className={styles.beaconList}>
            {beacons.map((beacon) => {
              const id = String(beacon.id);
              return (
                <li key={id}>
                  <Tile beacon={beacon} messages={messages} active={id === deviceId} onSelect={setDeviceId} />
                </li>
              );
            })}
          </ul>
          )}
          <nav className={styles.pagination} aria-label="Beacon pages">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => setPage(pagination.page - 1)}
            >
              Previous
            </button>
            <p>
              Page <strong>{pagination.page}</strong>
              <span>of {pagination.totalPages}</span>
            </p>
            <button
              type="button"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPage(pagination.page + 1)}
            >
              Next
            </button>
          </nav>
      </section>

      <MessageList className={styles.live} messages={messages} />
      </div>
    </main>
  );
}
