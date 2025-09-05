import { normalSample } from "./random";

/** Convert an angle in degrees to radians */
export const angleToRadians = (angle: number) => (angle * Math.PI) / 180;

/** Normally random sample a angle, given a base angle and spread */
export const randomAngle = (middleDegrees: number, spreadDegrees: number) => {
  const angle = normalSample(middleDegrees, spreadDegrees);
  return asAngle(angle);
};

/** Ensure an angle is between 0 and 360 */
export const asAngle = (angle: number): number => {
  return ((angle % 360) + 360) % 360;
};

/** Rotate an angle by a mutation, ensuring the result is between 0 and 360 */
export const rotateAngle = (angle: number, mutation: number) => {
  return asAngle(angle + mutation);
};
