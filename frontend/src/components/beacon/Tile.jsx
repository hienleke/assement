import { useState, useRef } from "react";
import { sendCommandToDevice } from "@/api/beacon.api.js";
import { DETAIL_FIELDS } from "@/constants/beacon.constants.js";
import styles from "./Tile.module.scss";

export function Tile({ beacon, messages, active, onSelect }) {
  const id = String(beacon.id);
  const [ledOn, setLedOn] = useState(false);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const pendingRef = useRef(false);
  const lastMessage = messages[0];

  console.log("messages data", messages);

  const toggleLed = async (enabled) => {
    if (pendingRef.current) return;
    pendingRef.current = true;
    setMessage("");
    try {
      let response = await sendCommandToDevice(id, { action: "SET_LED", enabled });
      if (response.ok) {
        setLedOn(enabled);
         onSelect(id);
      }
    } catch (err) {
      setMessage(err.message);
    } finally {
      pendingRef.current = false;
      setPending(false);
    }
  };
  return (
    <article
      className={active ? styles.cardActive : styles.card}
      onClick={() => onSelect(id)}
    >
      <header className={styles.header}>
        <div>
          <strong className={styles.id}>#{id}</strong>
          <span className={beacon.online ? styles.online : styles.offline}>
            {beacon.online ? "online" : "offline"}
          </span>
        </div>
        <label className={styles.switch} onClick={(event) => event.stopPropagation()}>
          <span className={styles.switchLabel}>LED</span>
          <input
            type="checkbox"
            role="switch"
            checked={ledOn}
            aria-label={`LED for beacon ${id}`}
            disabled={pending}
            onChange={(event) => {
              setPending(true);
              toggleLed(event.target.checked);
            }}
          />
          <span className={styles.track} />
        </label>
      </header>

      <dl className={styles.fields}>
        {DETAIL_FIELDS.map((field) => (
          <div key={field.key}>
            <dt>{field.label}</dt>
            <dd>
              {lastMessage?.payload?.[field.key] ?? beacon[field.key]}
              {field.unit ?? ""}
            </dd>
          </div>
        ))}
      </dl>
      {message ? <p className={styles.error}>{message}</p> : null}
    </article>
  );
}
