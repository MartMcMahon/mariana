import { Sprite } from "pixi.js";
import img_bubble from "../../../resources/images/bubble.png";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { rNormal } from "../../core/util/Random";
import { V2d } from "../../core/Vector";
import { Layer } from "../config/layers";

const SPEED = 12.0; // meters per second

export class Bubble extends BaseEntity implements Entity {
  constructor(position: V2d, private size: number = rNormal(0.22, 0.1)) {
    super();

    const sprite = (this.sprite = Sprite.from(img_bubble));
    sprite.position.set(position[0], position[1]);
    sprite.scale.set(size / sprite.texture.width);

    this.sprite.layerName = Layer.WORLD_FRONT;
  }

  onTick(dt: number) {
    this.sprite!.y -= dt * SPEED * this.size;

    if (this.sprite!.y <= 0) {
      this.destroy();
    }
  }
}
