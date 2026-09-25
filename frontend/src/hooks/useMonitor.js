import { useEffect, useState } from "react";
import { apiUrl, fetchBeacon, fetchBeacons } from "@/services/api.js";

export function useMonitor(deviceId) {
  const [beacons, setBeacons] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([]);
  const [streamStatus, setStreamStatus] = useState("connecting");

  useEffect(() => {
    let active = true;

    fetchBeacons()
      .then((rows) => {
        if (!active) return;
        setBeacons(rows);
        setSelectedId((current) => current ?? rows[0]?.id ?? null);
        setError("");
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (selectedId == null) return undefined;
    let active = true;

    fetchBeacon(selectedId)
      .then((beacon) => {
        if (!active) return;
        setSelected(beacon);
      })
      .catch((err) => {
        if (!active) return;
        setSelected(null);
        setError(err.message);
      });

    return () => {
      active = false;
    };
  }, [selectedId]);

  useEffect(() => {
    if (!deviceId) {
      setMessages([]);
      setStreamStatus("waiting for device");
      return undefined;
    }

    setMessages([]);
    setStreamStatus("connecting");
    const source = new EventSource(`${apiUrl}/messages/stream?deviceId=${encodeURIComponent(deviceId)}`);

    source.addEventListener("ready", (event) => {
      const data = JSON.parse(event.data);
      setStreamStatus(`live · ${data.topic}`);
    });

    source.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      setMessages((current) => [data, ...current].slice(0, 20));
    });

    source.onerror = () => {
      setStreamStatus("disconnected");
    };

    return () => {
      source.close();
    };
  }, [deviceId]);

  return {
    beacons,
    selectedId,
    setSelectedId,
    selected,
    error,
    messages,
    streamStatus,
  };
}
