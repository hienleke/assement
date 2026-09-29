import { useEffect, useState } from "react";
import { fetchBeacon, fetchBeacons } from "@/services/api.js";

/** Danh sách beacon + chi tiết của beacon đang chọn. */
export function useBeacons(deviceId) {
  const [beacons, setBeacons] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    fetchBeacons()
      .then((rows) => {
        if (!active) return;
        setBeacons(rows);
        setError("");
      })
      .catch((err) => {
        if (active) setError(err.message);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!deviceId) {
      setSelected(null);
      return undefined;
    }

    let active = true;

    fetchBeacon(deviceId)
      .then((beacon) => {
        if (active) setSelected(beacon);
      })
      // Id đang gõ dở thì 404 là bình thường, không coi là lỗi.
      .catch(() => {
        if (active) setSelected(null);
      });

    return () => {
      active = false;
    };
  }, [deviceId]);

  return { beacons, selected, error };
}
