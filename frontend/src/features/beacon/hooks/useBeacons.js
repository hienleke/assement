import { useEffect, useState } from "react";
import { fetchBeacon, fetchBeacons } from "@/features/beacon/api/beacon.api.js";

const EMPTY_PAGE = { page: 1, limit: 10, total: 0, totalPages: 1 };

export function useBeacons(deviceId) {
  const [beacons, setBeacons] = useState([]);
  const [pagination, setPagination] = useState(EMPTY_PAGE);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    fetchBeacons(pagination.page, pagination.limit)
      .then((rows) => {
        if (!active) return;
        setBeacons(rows.data ?? []);
        setPagination((current) => ({
          ...EMPTY_PAGE,
          ...rows.pagination,
          page: rows.pagination?.page ?? current.page,
          limit: rows.pagination?.limit ?? current.limit,
          totalPages: rows.pagination?.totalPages || 1,
        }));
        setError("");
      })
      .catch((err) => {
        if (active) setError(err.message);
      });

    return () => {
      active = false;
    };
  }, [pagination.page, pagination.limit]);

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
      .catch(() => {
        if (active) setSelected(null);
      });

    return () => {
      active = false;
    };
  }, [deviceId]);

  const setPage = (page) => {
    setPagination((current) => ({ ...current, page }));
  };

  return { beacons, pagination, setPage, selected, error };
}
