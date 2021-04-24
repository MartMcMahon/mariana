/**
 * A map of lists. Automatically creates and removes
 */
export default class ListMap<K, V> {
  private map: Map<K, V[]>;

  constructor() {
    this.map = new Map<K, V[]>();
  }

  add(key: K, value: V): void {
    if (!this.map.has(key)) {
      this.map.set(key, [value]);
    } else {
      this.map.get(key)!.push(value);
    }
  }

  get(key: K): ReadonlyArray<V> {
    return this.map.get(key) ?? [];
  }

  remove(key: K, value: V): void {
    if (this.map.has(key)) {
      const array = this.map.get(key)!;
      const index = array.indexOf(value);
      if (index >= 0) {
        array.splice(index, 1);
        if (array.length === 0) {
          this.map.delete(key);
        }
        return;
      }
    }
    throw new Error(`<${key}:${value}> not found`);
  }
}
