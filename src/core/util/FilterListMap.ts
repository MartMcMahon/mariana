import FilterList, { Filter } from "./FilterList";

export class FilterListMap<T> {
  private _lists = new Map<Filter<T, any>, FilterList<T, any>>();

  addFilter<T2 extends T>(filter: Filter<T, T2>, all: Iterable<T> = []) {
    if (!this._lists.has(filter)) {
      const list = new FilterList(filter);

      for (const item of all) {
        list.addIfValid(item);
      }

      this._lists.set(filter, list);
    }
  }

  removeFilter(filter: Filter<T, any>) {
    this._lists.delete(filter);
  }

  addItem(item: T) {
    for (const list of this._lists.values()) {
      list.addIfValid(item);
    }
  }

  removeItem(item: T) {
    for (const list of this._lists.values()) {
      list.remove(item);
    }
  }

  getFilterList<T2 extends T>(
    filter: Filter<T, T2>
  ): FilterList<T, T2> | undefined {
    return this._lists.get(filter);
  }
}
