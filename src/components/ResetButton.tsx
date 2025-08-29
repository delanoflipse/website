"use client";

import { TurfEvent, createTurfForEvent } from "@/lib/turf";

type ResetButtonProps = {
  event: string;
  onReset?: (x: TurfEvent) => void;
};

export default function ResetButton({ event, onReset }: Readonly<ResetButtonProps>) {
  const onClick = async () => {
    const data = await createTurfForEvent(event);
    if (onReset) onReset(data);
  };

  return (
    <div>
      <button onClick={onClick}>click me</button>
    </div>
  );
}
