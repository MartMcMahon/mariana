import { Sprite } from "pixi.js";
import img_bubble from "../../../resources/images/bubble.png";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { rNormal } from "../../core/util/Random";
import { V, V2d } from "../../core/Vector";
import { Layer } from "../config/layers";

const FRICTION = 1.5;

export class Bubble extends BaseEntity implements Entity {
  constructor(
    position: V2d,
    private velocity: V2d = V(0, 0),
    private size: number = rNormal(0.22, 0.1)
  ) {
    super();

    const sprite = (this.sprite = Sprite.from(img_bubble));
    sprite.position.set(position[0], position[1]);
    sprite.scale.set(size / sprite.texture.width);
    sprite.alpha = 0.7;

    this.sprite.layerName = Layer.WORLD_FRONT;
  }

  onTick(dt: number) {
    const sprite = this.sprite! as Sprite;
    this.velocity[1] += dt * -8;

    this.velocity.imul(Math.exp(-dt * FRICTION));

    this.size *= Math.exp(dt * 0.01);

    sprite.x += dt * this.velocity[0];
    sprite.y += dt * this.velocity[1];

    sprite.scale.set(this.size / sprite.texture.width);

    if (sprite.y <= 0) {
      this.destroy();
    }
  }
}
