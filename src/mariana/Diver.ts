import { Body, Circle } from "p2";
import { Sprite } from "pixi.js";
import snd_dead from "../../resources/audio/dead.flac";
import snd_oww from "../../resources/audio/oww.flac";
import img_diver from "../../resources/images/diver.png";
import { Bubble } from "./effects/Bubble";
import BaseEntity from "../core/entity/BaseEntity";
import Entity from "../core/entity/Entity";
import { ControllerAxis } from "../core/io/Gamepad";
import { SoundInstance } from "../core/sound/SoundInstance";
import { clamp } from "../core/util/MathUtil";
import { rBool } from "../core/util/Random";
import { V, V2d } from "../core/Vector";

const DIVER_RADIUS = 1.0; // Size in meters
const DIVER_SPEED = 35.0; // Newtons?
const DIVER_FRICTION = 6.0; // not really sure of the unit
const SURFACE_GRAVITY = 9.8; // meters / second

export class Diver extends BaseEntity implements Entity {
  sprite: Sprite;
  body: Body;
  // So we can easily grab the diver from other entities
  id = "diver";

  // Amount of health we have
  hp = 100;

  constructor(position: V2d = V(0, 0)) {
    super();

    this.body = new Body({ mass: 1, position: position.clone() });
    const shape = new Circle({ radius: DIVER_RADIUS });
    this.body.addShape(shape);

    this.sprite = Sprite.from(img_diver);
    this.sprite.scale.set((DIVER_RADIUS * 2) / this.sprite.texture.width);
    this.sprite.anchor.set(0.5);
  }

  // Return the current depth in meters under the surface
  getDepth() {
    return this.body.position[1];
  }

  onRender() {
    this.sprite.x = this.body.position[0];
    this.sprite.y = this.body.position[1];
  }

  onTick(dt: number) {
    if (this.getDepth() >= 0) {
      if (rBool(dt)) {
        this.game!.addEntity(new Bubble(this.getPosition().iadd([0, -0.7])));
      }
      if (this.hp > 0) {
        const movementDirection = this.getPlayerMoveInput();
        this.body.applyForce(movementDirection.imul(DIVER_SPEED));
      }

      const friction = V(this.body.velocity).imul(-DIVER_FRICTION);
      this.body.applyForce(friction);
    } else {
      this.body.applyForce([0, this.body.mass * SURFACE_GRAVITY]);
    }
  }

  // Returns the direction that the player wants the diver to move
  getPlayerMoveInput(): V2d {
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

    // so we don't move faster on diagonals
    movementDirection.magnitude = clamp(movementDirection.magnitude, 0, 1);

    return movementDirection;
  }

  damage(amount: number) {
    this.game?.addEntity(new SoundInstance(snd_oww));
    this.hp -= amount;

    if (this.hp <= 0) {
      this.game?.addEntity(
        new SoundInstance(snd_dead, { persistenceLevel: 1 })
      );
      this.game?.dispatch({ type: "diveEnd" });
    }
  }
}
