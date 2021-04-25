import { Body, Capsule, Circle } from "p2";
import { AnimatedSprite, Graphics, Sprite, Texture } from "pixi.js";
import Entity, { GameSprite } from "../../core/entity/Entity";
import BaseEntity from "../../core/entity/BaseEntity";
import { V, V2d } from "../../core/Vector";
import { rBool, rUniform } from "../../core/util/Random";
import img_shark from "../../../resources/images/shark.png";
import { Diver } from "../Diver";

const PATROLING = 0;
const CHASING = 1;

const SPEED = 3.5;
const FRICTION = 2.0;
const PATROL_TIME = 5.0;

export class Shark extends BaseEntity implements Entity {
  sprite: AnimatedSprite & GameSprite;
  body: Body;
  radius: number;

  movingRight = rBool();
  mode = PATROLING;

  constructor(position: V2d, radius: number = rUniform(1.0, 1.5)) {
    super();
    this.radius = radius;
    this.body = new Body({ mass: 1 });
    this.body.addShape(new Capsule({ length: radius * 2, radius }));
    this.body.position = position;

    this.sprite = AnimatedSprite.fromImages([img_shark]);
    this.sprite.animationSpeed = 1;
    this.sprite.autoUpdate = false;
    this.sprite.width = radius * 2;
    this.sprite.height = radius;
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
    this.mode = PATROLING;
  }

  async turnAround() {
    this.sprite.scale.x *= -1;
    this.movingRight = !this.movingRight;

    await this.wait(PATROL_TIME);
    this.turnAround();
  }

  onRender(dt: number) {
    this.sprite.position.set(...this.body!.position);
  }

  onTick(dt: number) {
    const direction = this.movingRight ? 1 : -1;
    this.body.applyForce([direction * SPEED, 0]);
    this.body.applyForce(V(this.body.velocity).imul(-FRICTION));
  }

  onBeginContact(other: Entity) {
    if (other instanceof Diver) {
      other.damage(20);
    }
  }
}
