import { Body, Circle } from "p2";
import { Sprite } from "pixi.js";
import img_diver from "../../resources/images/diver.png";
import BaseEntity from "../core/entity/BaseEntity";
import Entity from "../core/entity/Entity";
import Game from "../core/Game";
import { ControllerButton } from "../core/io/Gamepad";

const DIVER_RADIUS = 1.0; // Size in meters

export class Diver extends BaseEntity implements Entity {
  sprite: Sprite;
  body: Body;

  // So we can easily grab the diver from other entities
  id = "diver";

  constructor() {
    super();

    this.body = new Body({ mass: 1 });
    const shape = new Circle({ radius: DIVER_RADIUS });
    this.body.addShape(shape);

    this.sprite = Sprite.from(img_diver);
    this.sprite.scale.set((DIVER_RADIUS * 2) / this.sprite.texture.width);
    this.sprite.anchor.set(0.5);
  }

  onRender() {
    this.sprite.x = this.body.position[0];
    this.sprite.y = this.body.position[1];
  }

  onTick() {
    if (
      this.game!.io.keyIsDown("KeyS") ||
      this.game!.io.getButton(ControllerButton.D_DOWN)
    ) {
      this.body.applyForce([0, 10]);
    }
    if (
      this.game!.io.keyIsDown("KeyW") ||
      this.game!.io.getButton(ControllerButton.D_UP)
    ) {
      this.body.applyForce([0, -10]);
    }
    if (
      this.game!.io.keyIsDown("KeyA") ||
      this.game!.io.getButton(ControllerButton.D_LEFT)
    ) {
      this.body.applyForce([-10, 0]);
    }
    if (
      this.game!.io.keyIsDown("KeyD") ||
      this.game!.io.getButton(ControllerButton.D_RIGHT)
    ) {
      this.body.applyForce([10, 0]);
    }
  }
}
