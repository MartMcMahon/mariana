import { Body, Circle } from "p2";
import { Sprite } from "pixi.js";
import img_diver from "../../resources/images/diver.png";
import BaseEntity from "../core/entity/BaseEntity";
import Entity from "../core/entity/Entity";
import { ControllerAxis, ControllerButton } from "../core/io/Gamepad";
import { clamp } from "../core/util/MathUtil";
import { V, V2d } from "../core/Vector";

const DIVER_RADIUS = 1.0; // Size in meters
const DIVER_SPEED = 50.0; // Newtons?
const DIVER_FRICTION = 5; //
export class Diver extends BaseEntity implements Entity {
  sprite: Sprite;
  body: Body;

  // So we can easily grab the diver from other entities
  id = "diver";

  constructor(position: V2d = V(0, 0)) {
    super();

    this.body = new Body({ mass: 1, position: position.clone() });
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

  onTick(dt: number) {
    const movementDirection = V(
      this.game!.io.getAxis(ControllerAxis.LEFT_X),
      this.game!.io.getAxis(ControllerAxis.LEFT_Y)
    );
    if (this.game!.io.keyIsDown("KeyS")) {
      movementDirection[1] += 1;
    }
    if (this.game!.io.keyIsDown("KeyW")) {
      movementDirection[1] -= 1;
    }
    if (this.game!.io.keyIsDown("KeyA")) {
      movementDirection[0] -= 1;
    }
    if (this.game!.io.keyIsDown("KeyD")) {
      movementDirection[0] += 1;
    }

    movementDirection[0] = clamp(movementDirection[0], -1, 1);
    movementDirection[1] = clamp(movementDirection[1], -1, 1);

    this.body.applyForce(movementDirection.imul(DIVER_SPEED));

    const friction = V(this.body.velocity).imul(-DIVER_FRICTION);
    this.body.applyForce(friction);
  }
}
