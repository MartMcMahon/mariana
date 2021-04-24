import { mod } from "./MathUtil";

/**
 * Utility functions for doing things based on random numbers.
 */

// just for shorthand
const r = Math.random;

/** Return a random number between `min` and `max`. */
export function rUniform(min: number, max: number): number {
  if (min == null) {
    return r();
  }
  if (max == null) {
    max = min;
    min = 0;
  }
  return (max - min) * r() + min;
}

/** A random angle in radians */
export function rDirection(): number {
  return rUniform(0, Math.PI * 2);
}

/** One of the four cardinal directions, in radians */
export function rCardinal(): number {
  return choose(0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2);
}

/**
 * Returns a random number from an (approximately) normal distribution
 * centered at `mean` with `deviation`
 */
export function rNormal(mean: number = 0.0, deviation: number = 1.0): number {
  return (deviation * (r() + r() + r() + r() + r() + r() - 3)) / 3 + mean;
}

/** Return true or false, chosen at random. */
export function rBool(chanceOfTrue: number = 0.5): boolean {
  return r() < chanceOfTrue;
}

export function rSign(chanceOfPositive: number = 0.5): -1 | 1 {
  return rBool(chanceOfPositive) ? 1 : -1;
}

/** Return a random integer in range [min, max) */
export function rInteger(min: number, max: number): number {
  return Math.floor(rUniform(min, max));
}

export function rByte(): number {
  return rInteger(0, 256);
}

/**
 * Probabilistically round x to a nearby integer.
 */
export function rRound(x: number): number {
  const low = Math.floor(x);
  return rBool(x - low) ? low : low + 1;
}

/** Return a random element from an array. */
export function choose<T>(...options: T[]): T {
  return options[rInteger(0, options.length)];
}

/** Remove and return a random element from an array. */
export function take<T>(options: T[]): T {
  return options.splice(rInteger(0, options.length), 1)[0];
}

/** Put an array into a random order and return the array. */
export function shuffle<T>(a: T[]): T[] {
  let i, j;
  i = a.length;
  while (--i > 0) {
    j = rInteger(0, i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Put an array into a deterministically random order and return the array. Seed should be an integer */
export function seededShuffle<T>(a: T[], seed: number): T[] {
  let i, j, temp;
  i = a.length;
  while (--i > 0) {
    seed = (seed * 1103515245 + 12345) | 0;
    j = mod(seed, i + 1);
    temp = a[j];
    a[j] = a[i];
    a[i] = temp;
  }
  return a;
}
