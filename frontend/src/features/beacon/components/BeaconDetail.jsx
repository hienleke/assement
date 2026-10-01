import { DETAIL_FIELDS } from "@/features/beacon/constants/beacon.constants.js";
import styles from "./BeaconDetail.module.scss";

export function BeaconDetail({ beacon }) {
  return (
    <dl className={styles.detail}>
      {DETAIL_FIELDS.map((field) => (
        <div key={field.key}>
          <dt>{field.label}</dt>
          <dd>
            {beacon[field.key]}
            {field.unit ?? ""}
          </dd>
        </div>
      ))}
    </dl>
  );
}
