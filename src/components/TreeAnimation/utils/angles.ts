import { normalSample } from "./random";

export const angleToRadians = (angle: number) => (angle * Math.PI) / 180;

export const randomAngle = (middleDegrees: number, spreadDegrees: number) => {
  const angle = normalSample(middleDegrees, spreadDegrees);
  return asAngle(angle);
};

// return an angle between 0-360
export const asAngle = (angle: number): number => {
  return ((angle % 360) + 360) % 360;
};

export const rotateAngle = (angle: number, mutation: number) => {
  return asAngle(angle + mutation);
};
