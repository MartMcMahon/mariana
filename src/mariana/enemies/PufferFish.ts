import { Body } from "p2";
import { AnimatedSprite } from "pixi.js";
import img_puffer0 from "../../../resources/images/puffer0.png";
import img_puffer1 from "../../../resources/images/puffer1.png";
import img_puffer2 from "../../../resources/images/puffer2.png";
import img_puffer3 from "../../../resources/images/puffer3.png";
import img_puffer4 from "../../../resources/images/puffer4.png";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { rBool, rUniform } from "../../core/util/Random";
import { V, V2d } from "../../core/Vector";
import { Diver } from "../Diver";
import { GroundTile } from "../region/GroundTile";
import { BaseFish } from "./BaseFish";

const SPEED = 5;
const FRICTION = 2.0;
const PATROL_TIME = 5.0; // seconds travelled in each direction

export class PufferFish extends BaseFish {
  sprite: AnimatedSprite & GameSprite;

  movingRight = rBool();

  constructor(position: V2d, radius: number = rUniform(1.0, 1.5)) {
    super(position, 2 * radius, 1.5 * radius);

    this.sprite = AnimatedSprite.fromImages([
      img_puffer0,
      img_puffer1,
      img_puffer2,
      img_puffer3,
      img_puffer4,
    ]);

    this.sprite.animationSpeed = rUniform(0.9, 1.2);
    this.sprite.autoUpdate = false;
    this.sprite.width = radius * 2;
    this.sprite.height = radius * 2;
    this.sprite.anchor.set(0.5);
    this.sprite.loop = true;
    this.sprite.position.set(...position);

    if (this.movingRight) {
      this.sprite.scale.x *= -1;
    }
  }

  async onAdd() {
    await this.wait(Math.random() * PATROL_TIME);
    this.turnAround();
  }

  async turnAround() {
    this.sprite.scale.x *= -1;
    this.movingRight = !this.movingRight;

    await this.wait(PATROL_TIME);
    this.turnAround();
  }

  onTick(dt: number) {
    super.onTick(dt);
    const direction = this.movingRight ? 1 : -1;
    this.swim(V(direction, 0));
  }

  onBeginContact(other: Entity) {
    if (other instanceof Diver) {
      other.damage(20);
    } else if (other instanceof GroundTile) {
      this.turnAround();
    }
  }
}
