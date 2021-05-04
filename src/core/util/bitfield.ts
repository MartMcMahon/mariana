/** Creates a bitfield out of booleans */
export function makeBitfield(...bits: boolean[]): number {
  let result = 0;
  for (let i = 0; i < bits.length; i++) {
    if (bits[i]) {
      result |= 1 << (bits.length - i - 1);
    }
  }
  return result;
}

(window as any).makeBitfield = makeBitfield;
