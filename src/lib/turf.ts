export type TurfEvent = {
  id: number;
  event: string;
  time: string;
};

export const getLatestTurfForEvent = async (
  event_name: string
): Promise<TurfEvent> => {
  const res = await fetch(`/api/turfs?event=${event_name}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return data;
};

export const createTurfForEvent = async (
  event_name: string
): Promise<TurfEvent> => {
  const res = await fetch("/api/turfs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      event_name,
    }),
  });

  const data = await res.json();
  return data;
};
