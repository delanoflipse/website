// Define a 'brand' to uniquely identify our type
declare const __brand: unique symbol;

// Create the branded type
export type NormalizedValue = number & { [__brand]: "NormalizedValue" };

// A type guard function to check if a number is a valid NormalizedValue
export const isNormalized = (value: number): value is NormalizedValue => {
  return value >= 0 && value <= 1;
};

/** Clamps a number between a minimum and maximum value. */
export const clamp = (value: number | NormalizedValue): NormalizedValue => {
  const x = Math.max(0, Math.min(1, value));

  if (isNormalized(x)) {
    return x;
  }

  throw new Error("Could not clamp!? " + x);
};

export const easedValue = (value: NormalizedValue): NormalizedValue => {
  return asNormalized(value * value * (3 - 2 * value));
};

export const normalise = (value: number, maxValue: number): NormalizedValue => {
  return asNormalized(value / maxValue);
};

export const invert = (normValue: NormalizedValue): NormalizedValue => {
  return asNormalized(1 - normValue);
};

/** move value of [0, 1] into [min, max] */
export const lerp = (
  value: NormalizedValue,
  min: number,
  max: number
): NormalizedValue => {
  if (isNormalized(min) && isNormalized(max)) {
    return asNormalized(value * (max - min) + min);
  }

  throw new Error("Invalid range!");
};

/** move value of [min, max] into [0, 1] */
export const lerpInv = (
  value: NormalizedValue,
  min: number,
  max: number
): NormalizedValue => {
  if (isNormalized(min) && isNormalized(max)) {
    return asNormalized((value - min) / (max - min));
  }

  throw new Error("Invalid range!");
};

export const randomSample = (
  min: number = 0,
  max: number = 1
): NormalizedValue => {
  return clamp(Math.random() * (max - min) + min);
};

export const asNormalized = (value: number): NormalizedValue => {
  if (isNormalized(value)) {
    return value;
  }

  return clamp(value);
};

export const square = (value: NormalizedValue): NormalizedValue => {
  return asNormalized(value * value);
};
