import { Body, Circle } from "p2";
import { Graphics, Sprite } from "pixi.js";
import img_diver from "../../resources/images/diver.png";
import BaseEntity from "../core/entity/BaseEntity";
import Entity from "../core/entity/Entity";

const DIVER_RADIUS = 1.0; // Size in meters

export class Diver extends BaseEntity implements Entity {
  sprite: Sprite;
  body: Body;

  constructor() {
    super();

    this.body = new Body({ mass: 1 });
    const shape = new Circle({ radius: DIVER_RADIUS });
    this.body.addShape(shape);

    // this.sprite = new Graphics();
    // this.sprite.beginFill(0xffff00);
    // this.sprite.drawCircle(0, 0, DIVER_RADIUS);
    // this.sprite.endFill();

    this.sprite = Sprite.from(img_diver);
    this.sprite.scale.set(DIVER_RADIUS / this.sprite.texture.width);

  }

  onRender() {
    this.sprite.x = this.body.position[0];
    this.sprite.y = this.body.position[1];
  }

  onTick() {
    if (this.game!.io.keyIsDown("KeyS")) {
      this.body.applyForce([0, 10]);
    }
    if (this.game!.io.keyIsDown("KeyW")) {
      this.body.applyForce([0, -10]);
    }
    if (this.game!.io.keyIsDown("KeyA")) {
      this.body.applyForce([-10, 0]);
    }
    if (this.game!.io.keyIsDown("KeyD")) {
      this.body.applyForce([10, 0]);
    }
  }
}
