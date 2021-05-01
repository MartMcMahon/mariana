import { AnimatedSprite } from "pixi.js";
import img_stingRay1 from "../../../resources/images/fish/sting_ray_1.png";
import img_stingRay2 from "../../../resources/images/fish/sting_ray_2.png";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { rBool } from "../../core/util/Random";
import { V, V2d } from "../../core/Vector";
import { Diver } from "../diver/Diver";
import { GroundTile } from "../region/GroundTile";
import { BaseFish } from "./BaseFish";

const SPEED = 5;
const FRICTION = 2.0;
const PATROL_TIME = 5.0; // seconds travelled in each direction
const WIDTH = 3;
const HEIGHT = 1;

export class StingRay extends BaseFish {
  sprite: AnimatedSprite & GameSprite;

  movingRight = rBool();

  constructor(position: V2d) {
    super(position, {
      width: WIDTH,
      height: HEIGHT,
      speed: SPEED,
      friction: FRICTION,
      hp: 20,
      dropValue: 10,
    });

    this.sprite = AnimatedSprite.fromImages([img_stingRay1, img_stingRay2]);

    this.sprite.animationSpeed = 1;
    this.sprite.autoUpdate = false;
    this.sprite.scale.set(WIDTH / this.sprite.texture.width);
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

  onRender(dt: number) {
    this.sprite.position.set(...this.body!.position);
    this.sprite.update(dt);
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
