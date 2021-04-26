import { Sprite } from "pixi.js";
import img_blood1 from "../../../resources/images/blood-1.png";
import img_blood2 from "../../../resources/images/blood-2.png";
import img_blood3 from "../../../resources/images/blood-3.png";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { choose, rDirection, rUniform } from "../../core/util/Random";
import { V, V2d } from "../../core/Vector";
import { Layer } from "../config/layers";

const FRICTION = 1.5;

export class SurfaceSplash extends BaseEntity implements Entity {
  constructor(
    position: V2d,
    private velocity: V2d = V(0, 0),
    private angularVelocity: number = rUniform(-2, 2),
    private size: number = rUniform(0.8, 2.0)
  ) {
    super();

    const sprite = (this.sprite = Sprite.from(
      choose(img_blood1, img_blood2, img_blood3)
    ));
    sprite.position.set(position[0], position[1]);
    sprite.scale.set(size / sprite.texture.width);
    sprite.rotation = rDirection();
    sprite.alpha = 0.7;
    sprite.anchor.set(0.5);

    this.sprite.layerName = Layer.WORLD_FRONT;
  }

  async onAdd() {
    await this.wait(rUniform(4, 6), (dt, t) => {
      this.sprite!.alpha = (1.0 - t) ** 2 * 0.7;
    });
    this.destroy();
  }

  onTick(dt: number) {
    const sprite = this.sprite! as Sprite;

    this.velocity.imul(Math.exp(-dt * FRICTION));
    this.angularVelocity *= Math.exp(-dt * FRICTION);
    this.size *= Math.exp(dt / this.size);

    sprite.x += dt * this.velocity[0];
    sprite.y += dt * this.velocity[1];
    sprite.rotation += this.angularVelocity * dt;

    sprite.scale.set(this.size / sprite.texture.width);

    if (sprite.y <= 0) {
      this.destroy();
    }
  }
}
