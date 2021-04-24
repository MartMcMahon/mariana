import * as Pixi from "pixi.js";
import { V2d, V } from "../Vector";

/**
 * Info about a rendering layer
 */
export class LayerInfo {
  readonly container: Pixi.Container;
  paralax: number;
  anchor: V2d;

  constructor({ paralax, anchor, filters, alpha }: LayerInfoOptions = {}) {
    this.container = new Pixi.Container();
    this.paralax = paralax ?? 1.0;
    this.anchor = anchor ?? V([0, 0]);
    this.container.filters = filters ?? [];
    this.container.alpha = alpha ?? 1.0;
  }
}

export interface LayerInfoOptions {
  paralax?: number;
  anchor?: V2d;
  filters?: Pixi.Filter[];
  alpha?: number;
}
