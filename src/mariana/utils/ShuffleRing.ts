import { shuffle } from "../../core/util/Random";

// For when you want to get a random element out of a set,
// but you wanna make sure you're not getting the same one twice in a row
export class ShuffleRing<T> {
  index: number = -1;

  constructor(private values: T[]) {
    shuffle(values);
  }

  getNext(): T {
    this.index += 1;
    if (this.index >= this.values.length) {
      this.index = 0;
      shuffle(this.values);
    }
    return this.values[this.index];
  }
}
