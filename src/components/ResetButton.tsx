"use client";

export default function ResetButton({ event }) {
  const onClick = async () => {
    const res = await fetch("/api/turfs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event_name: event,
      }),
    });
  };

  return (
    <div>
      <button onClick={onClick}>click me</button>
    </div>
  );
}
