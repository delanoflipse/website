/** Clamps a number between a minimum and maximum value. */
const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

/**
 * Generates a random number from a normal (Gaussian) distribution
 * with a specified center and spread, constrained to a range around the center.
 *
 * @param center The center (mean) of the distribution.
 * @param spread The spread (standard deviation).
 * @returns A number sampled from the distribution, clamped between [center-spread, center+spread].
 */
export const normalSample = (center: number, spread: number): number => {
  // The Box-Muller transform requires two uniformly distributed random numbers in (0, 1].
  const u1 = clamp(Math.random(), Number.EPSILON, 1);
  const u2 = clamp(Math.random(), Number.EPSILON, 1);

  // Apply the Box-Muller transform to generate a standard normal variable (z).
  // This value has a mean of 0 and a standard deviation of 1.
  const boxMuller =
    Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

  // Scale and translate the standard normal variable (z) to our desired distribution.
  // The new value 'y' will have a mean of 'x' and a standard deviation of 's'.
  const value = center + spread * boxMuller;

  return clamp(value, center - spread, center + spread);
};

export const integerNormalSample = (center: number, spread: number): number => {
  const value = normalSample(center, spread);
  return Math.round(value);
};
