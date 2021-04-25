import { Body, Capsule, vec2 } from "p2";
import { AnimatedSprite, ObservablePoint } from "pixi.js";
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
  }

  async onAdd() {
    await this.wait(Math.random() * PATROL_TIME);
    // this.turnAround();
    this.mode = CHASING;
  }

  // unused
  // async turnAround() {
  //   this.sprite.scale.x *= -1;
  //   this.movingRight = !this.movingRight;

    // await this.wait(PATROL_TIME);
    // this.turnAround();
  // }

  flip() {
    this.sprite.scale.x *= -1;
  }

  onRender(dt: number) {
    this.sprite.position.set(...this.body!.position);
  }

  onTick(dt: number) {
    // check mode change
    const diverPos = this.game?.entities.getById("diver")?.body?.position || V(0,0);
    let dist = vec2.distance(this.body.position, diverPos);

    let direction = V(0, 0);
    if (dist < 20) {
      direction = this.getPosition().sub(diverPos).normalize().imul(-SPEED)
    } else {
      direction = V(0,0)
    }

    // this doesn't do what's intended
    // if (direction[0] > 0) {
    //   this.sprite.scale.x = -1;
    //   this.movingRight = true;
    // } else if (direction[0] < 0) {
    //   this.sprite.scale.x = 1;
    //   this.movingRight = false;
    // }

    this.body.applyForce(direction);
    this.body.applyForce(V(this.body.velocity).imul(-FRICTION));
  }
}
