// @ts-nocheck
/*
 * Attach all sorts of hacky stuff to the global state.
 */

import * as PIXI from "pixi.js";
import "regenerator-runtime/runtime";

export async function polyfill() {
  // (window as any).P2_ARRAY_TYPE = Array;
  if (!window.AudioContext && window.webkitAudioContext) {
    window.AudioContext = window.webkitAudioContext;
  }

  window.PIXI = PIXI;
}
