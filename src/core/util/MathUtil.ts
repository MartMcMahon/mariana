import { V2d, V } from "../Vector";

// Modulo operator for modular arithmetic
export function mod(a: number, b: number): number {
  return ((a % b) + b) % b;
}

// Make sure a value is >= zero
export function clampUp(value: number) {
  return Math.max(value, 0);
}

// Limit a value to be in a range.
export function clamp(value: number, min = 0, max = 1): number {
  return Math.max(min, Math.min(max, value));
}

// The smoothstep function between 0 and 1
export function smoothStep(t: number): number {
  t = clamp(t);
  return 3 * t ** 2 - 2 * t ** 3;
}

export function smootherStep(t: number): number {
  t = clamp(t);
  return 6 * t ** 5 - 15 * t ** 4 + 10 * t ** 3;
}

export function lerp(a: number, b: number, t: number = 0.5): number {
  return (1 - t) * a + t * b;
}

export function lerpOrSnap(
  a: number,
  b: number,
  t: number = 0.5,
  threshold: number = 0.01
): number {
  if (Math.abs(b - a) < threshold) {
    return b;
  }
  return lerp(a, b, t);
}

/** Normalizes an angle in radians to be in the range [-pi, pi] */
export function normalizeAngle(angle: number) {
  return mod(angle + Math.PI, Math.PI * 2) - Math.PI;
}

// Return the difference between two angles
export function angleDelta(a: number, b: number): number {
  return mod(b - a + Math.PI, Math.PI * 2) - Math.PI;
}

export function degToRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function radToDeg(radians: number): number {
  return (radians * 180) / Math.PI;
}

/** Returns the result of reflecting an angle across the X axis. */
export function reflectX(theta: number): number {
  return normalizeAngle(Math.PI - theta);
}

/** Returns the result of reflecting an angle across the Y axis. */
export function reflectY(theta: number): number {
  return normalizeAngle(-theta);
}

export function reflectXY(theta: number): number {
  return normalizeAngle(theta - Math.PI);
}

export function polarToVec(theta: number, r: number): V2d {
  return V(r * Math.cos(theta), r * Math.sin(theta));
}

export function isCCW(points: readonly V2d[]): boolean {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    const [x1, y1] = points[i - 1];
    const [x2, y2] = points[i];
    total += (x2 - x1) * (y2 + y1);
  }
  return total > 0;
}

// Step from one number towards another with a maximum step size
export function stepToward(from: number, to: number, stepSize: number): number {
  if (to > from) {
    return Math.min(from + stepSize, to);
  } else {
    return Math.max(from - stepSize, to);
  }
}
