import { Body, Circle } from "p2";
import { Sprite } from "pixi.js";
import snd_dead from "../../resources/audio/dead.flac";
import snd_oww from "../../resources/audio/oww.flac";
import img_diver from "../../resources/images/diver.png";
import img_diverLeft from "../../resources/images/diver_left.png";
import img_diverRight from "../../resources/images/diver_right.png";
import BaseEntity from "../core/entity/BaseEntity";
import Entity from "../core/entity/Entity";
import { SoundInstance } from "../core/sound/SoundInstance";
import { rBool } from "../core/util/Random";
import { V, V2d } from "../core/Vector";
import { BreatheEffect } from "./effects/BreatheEffect";
import { Bubble } from "./effects/Bubble";
import { HarpoonGun } from "./weapons/HarpoonGun";

const DIVER_RADIUS = 1.0; // Size in meters
const DIVER_SPEED = 35.0; // Newtons?
const DIVER_DAMPING = 0.1; // Water friction
const DIVER_BUOYANCY = 1.5; //
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

  onBoat = true;

  subSprites: Sprites = {
    forward: Sprite.from(img_diver),
    left: Sprite.from(img_diverLeft),
    right: Sprite.from(img_diverRight),
  };

  harpoonGun: HarpoonGun;

  aimDirection: V2d = V(0, 1);
  moveDirection: V2d = V(0, 0);

  constructor(position: V2d = V(0, 0)) {
    super();

    this.harpoonGun = this.addChild(new HarpoonGun(this));

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

    this.addChild(new BreatheEffect(this));
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

    const xMove = this.moveDirection[0];
    if (xMove > 0.1) {
      this.setSprite("right");
    } else if (xMove < -0.1) {
      this.setSprite("left");
    } else {
      this.setSprite("forward");
    }
  }

  onTick(dt: number) {
    if (!this.onBoat) {
      if (!this.isSurfaced()) {
        if (this.hp > 0) {
          this.body.applyForce(this.moveDirection.mul(DIVER_SPEED));
        }

        this.body.applyDamping(DIVER_DAMPING);
        this.body.applyForce([
          0,
          (this.body.mass * SURFACE_GRAVITY) / DIVER_BUOYANCY,
        ]);
      } else {
        this.body.applyForce([0, this.body.mass * SURFACE_GRAVITY]);
      }
    }
  }

  jump() {
    if (this.onBoat) {
      this.onBoat = false;
      this.body.applyImpulse(V(1.6, -2));
    }
  }

  damage(amount: number) {
    this.game?.addEntity(new SoundInstance(snd_oww));
    this.hp -= amount;

    this.game?.dispatch({ type: "diverHeart", amount });

    if (this.hp <= 0) {
      this.game?.addEntity(
        new SoundInstance(snd_dead, { persistenceLevel: 1 })
      );
      this.game?.dispatch({ type: "diveEnd" });
    }
  }

  shoot() {
    if (!this.onBoat) {
      this.harpoonGun.shoot(this.aimDirection);
    }
  }
}
