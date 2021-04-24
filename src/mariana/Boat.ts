import { Sprite } from "pixi.js";
import img_boat from "../../resources/images/boat.png";
import BaseEntity from "../core/entity/BaseEntity";
import Entity from "../core/entity/Entity";
import { Layer } from "./config/layers";

/** The boat on the surface */
export class Boat extends BaseEntity implements Entity {
  constructor() {
    super();

    const sprite = (this.sprite = Sprite.from(img_boat));
    sprite.x = 7;
    sprite.y = 0;
    sprite.anchor.set(0.5, 0.8);
    sprite.scale.set(10 / sprite.texture.width);

    this.sprite.layerName = Layer.WORLD_BACK;
  }
}
