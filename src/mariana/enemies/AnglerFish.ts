import { AnimatedSprite } from "pixi.js";
import img_angler1 from "../../../resources/images/angler_1.png";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { rBool } from "../../core/util/Random";
import { V, V2d } from "../../core/Vector";
import { Diver } from "../Diver";
import { GroundTile } from "../region/GroundTile";
import { BaseFish } from "./BaseFish";

const SPEED = 5;
const FRICTION = 2.0;
const PATROL_TIME = 5.0; // seconds travelled in each direction
const WIDTH = 3;
const HEIGHT = 1;

export class AnglerFish extends BaseFish {
  sprite: AnimatedSprite & GameSprite;

  movingRight = rBool();

  constructor(position: V2d) {
    super(position, WIDTH, HEIGHT, SPEED, FRICTION);

    this.sprite = AnimatedSprite.fromImages([img_angler1]);

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
    this.clearTimers("turnAround");
    this.sprite.scale.x *= -1;
    this.movingRight = !this.movingRight;

    await this.wait(PATROL_TIME, undefined, "turnAround");
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
