import { createTurfForEvent, getLatestTurfForEvent } from "@/lib/turf";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";

export const useTurf = (EVENT_NAME: string) => {
  const [value, setValue] = useState<dayjs.Dayjs | null>(null);
  const [loading, setLoading] = useState(true);

  const updateLastTimes = useCallback(async () => {
    setLoading(true);
    const turf = await getLatestTurfForEvent(EVENT_NAME);
    setValue(dayjs(turf?.time));
    setLoading(false);
  }, [EVENT_NAME]);

  // Fetch initial value on mount
  useEffect(() => {
    updateLastTimes();
  }, [updateLastTimes]);

  // Function to create a new turf entry and refresh the value
  const update = useCallback(async () => {
    await createTurfForEvent(EVENT_NAME);
    setValue(dayjs());
  }, [EVENT_NAME]);

  return {
    value,
    loading,
    update,
  };
};
