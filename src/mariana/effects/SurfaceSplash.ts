import { Sprite } from "pixi.js";
import img_waterSplash from "../../../resources/images/water-splash.png";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { rDirection, rUniform } from "../../core/util/Random";
import { V, V2d } from "../../core/Vector";
import { Layer } from "../config/layers";
import { getWaves } from "./Waves";

const FRICTION = 0.8;
const GRAVITY = 1.5;

export class SplashParticle extends BaseEntity implements Entity {
  constructor(
    position: V2d,
    private velocity: V2d = V(0, 0),
    private size: number = rUniform(0.1, 0.25)
  ) {
    super();

    const sprite = (this.sprite = Sprite.from(img_waterSplash));
    sprite.position.set(position[0], position[1]);
    sprite.scale.set(size / sprite.texture.width);
    sprite.rotation = rDirection();
    sprite.alpha = 1.0;
    sprite.anchor.set(0.5);
    sprite.tint = 0x99aaff;

    this.sprite.layerName = Layer.WORLD_FRONT;
  }

  async onAdd() {
    await this.wait(rUniform(4, 6), (dt, t) => {
      this.sprite!.alpha = (1.0 - t) ** 2 * 0.7;
    });
    this.destroy();
  }

  onTick(dt: number) {
    const waves = getWaves(this.game!);
    const sprite = this.sprite! as Sprite;

    this.velocity.imul(Math.exp(-dt * FRICTION));
    this.velocity.iadd([0, GRAVITY * dt]);

    sprite.x += dt * this.velocity[0];
    sprite.y += dt * this.velocity[1];

    sprite.scale.set(this.size / sprite.texture.width);

    if (sprite.y >= waves.getSurfaceHeight(sprite.x)) {
      this.destroy();
    }
  }
}
