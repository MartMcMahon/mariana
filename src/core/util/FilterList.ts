export type Filter<T, T2 extends T> = (item: T) => item is T2;

// A list that will only inlcude things that match the filter
export default class FilterList<T, T2 extends T> implements Iterable<T2> {
  private _items: Set<T2> = new Set();

  constructor(private predicate: Filter<T, T2>) {}

  addIfValid(item: T) {
    if (this.predicate(item)) {
      this._items.add(item);
    }
  }

  remove(item: T) {
    if (this.predicate(item)) {
      this._items.delete(item);
    }
  }

  get size() {
    return this._items.size;
  }

  [Symbol.iterator]() {
    return this._items[Symbol.iterator]();
  }
}
