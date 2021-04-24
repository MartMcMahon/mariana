export function identity<T>(a: T): T {
  return a;
}

export function last<T>(a: T[]): T {
  return a[a.length - 1];
}
