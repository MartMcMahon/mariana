import { Graphics } from "pixi.js";
import BaseEntity from "../core/entity/BaseEntity";
import Entity from "../core/entity/Entity";
import { Layer } from "./config/layers";
import { OCEAN_DEPTH } from "./constants";

export class WaterOverlay extends BaseEntity implements Entity {
  constructor() {
    super();

    const water = (this.sprite = new Graphics());
    water.beginFill(0x0000ff);
    water.drawRect(-1000, 0, 2000, OCEAN_DEPTH);
    water.endFill();

    water.alpha = 0.3;

    this.sprite.layerName = Layer.WORLD_FRONT;
  }
}
