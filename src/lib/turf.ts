export type TurfEvent = {
  id: number;
  event: string;
  time: string;
};

/** Helper to format fetch requests with JSON */
const asJsonRequest = (data: any = null) => {
  return {
    headers: {
      "Content-Type": "application/json",
    },
    body: data == null ? null : JSON.stringify(data),
  };
};

/** Fetch the latest turf entry for a specific event */
export const getLatestTurfForEvent = async (
  event_name: string
): Promise<TurfEvent> => {
  const res = await fetch(`/api/turfs?event=${event_name}`, {
    method: "GET",
    ...asJsonRequest(),
  });

  const data = await res.json();
  return data;
};

/** Create a new turf entry */
export const createTurfForEvent = async (
  event_name: string
): Promise<TurfEvent> => {
  const payload = { event_name };

  const res = await fetch("/api/turfs", {
    method: "POST",
    ...asJsonRequest(payload),
  });

  const data = await res.json();
  return data;
};
