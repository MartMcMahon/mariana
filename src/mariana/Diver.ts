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
import img_diverLeft from "../../resources/images/diver_left.png";
import img_diverRight from "../../resources/images/diver_right.png";

const DIVER_RADIUS = 1.0; // Size in meters
const DIVER_SPEED = 35.0; // Newtons?
const DIVER_FRICTION = 6.0; // not really sure of the unit
const SURFACE_GRAVITY = 9.8; // meters / second

interface Sprites {
  forward: Sprite;
  left: Sprite;
  right: Sprite;
}
export class Diver extends BaseEntity implements Entity {
  sprite: Sprite;
  body: Body;
  // So we can easily grab the diver from other entities
  id = "diver";

  // Amount of health we have
  hp = 100;

  subSprites: Sprites = {
    forward: Sprite.from(img_diver),
    left: Sprite.from(img_diverLeft),
    right: Sprite.from(img_diverRight),
  };

  constructor(position: V2d = V(0, 0)) {
    super();

    this.body = new Body({ mass: 1, position: position.clone() });
    const shape = new Circle({ radius: DIVER_RADIUS });
    this.body.addShape(shape);

    this.sprite = new Sprite();
    this.sprite.anchor.set(0.5);
    for (const subSprite of Object.values(this.subSprites) as Sprite[]) {
      subSprite.scale.set((2 * DIVER_RADIUS) / subSprite.texture.width);
      subSprite.anchor.set(0.5);
      this.sprite.addChild(subSprite);
    }

    this.setSprite("forward");
  }

  setSprite(visibleSprite: keyof Sprites) {
    for (const [name, sprite] of Object.entries(this.subSprites)) {
      sprite.visible = name === visibleSprite;
    }
  }

  // Return the current depth in meters under the surface
  getDepth() {
    return this.body.position[1];
  }

  isSurfaced() {
    return this.getDepth() <= 0;
  }

  onRender() {
    this.sprite.x = this.body.position[0];
    this.sprite.y = this.body.position[1];

    const xMove = this.getPlayerMoveInput()[0];
    if (xMove > 0.1) {
      this.setSprite("right");
    } else if (xMove < -0.1) {
      this.setSprite("left");
    } else {
      this.setSprite("forward");
    }
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
