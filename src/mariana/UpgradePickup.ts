import { Body, Particle } from "p2";
import { AnimatedSprite } from "pixi.js";
import snd_bellPositive1 from "../../resources/audio/bell_positive_1.flac";
import img_pickup1 from "../../resources/images/pickup-1.png";
import img_pickup2 from "../../resources/images/pickup-2.png";
import img_pickup4 from "../../resources/images/pickup-4.png";
import img_pickup5 from "../../resources/images/pickup-5.png";
import img_pickup6 from "../../resources/images/pickup-6.png";
import img_pickup7 from "../../resources/images/pickup-7.png";
import BaseEntity from "../core/entity/BaseEntity";
import Entity from "../core/entity/Entity";
import { SoundInstance } from "../core/sound/SoundInstance";
import { V, V2d } from "../core/Vector";
import { CollisionGroups } from "./config/CollisionGroups";
import { Diver } from "./Diver";

const MAGNET_RADIUS = 4;
const MAGNET_FORCE = 5;
const GRAVITY = 3; // meters / sec^2
const FRICTION = 2; // meters / sec^2

export class UpgradePickup extends BaseEntity implements Entity {
  sprite: AnimatedSprite;
  body: Body;

  constructor(position: V2d, public value: number = 1) {
    super();

    this.sprite = AnimatedSprite.fromImages([
      img_pickup1,
      img_pickup2,
      img_pickup4,
      img_pickup5,
      img_pickup6,
      img_pickup7,
    ]);

    this.sprite.anchor.set(0.5);
    this.sprite.width = this.sprite.height = 0.5 + Math.sqrt(value) * 0.1;
    this.sprite.animationSpeed = 8;

    this.body = new Body({ mass: 0.01, fixedRotation: true, position });
    this.body.addShape(
      new Particle({
        collisionMask: CollisionGroups.World | CollisionGroups.Diver,
      })
    );
  }

  onTick() {
    this.body.applyForce([0, GRAVITY * this.body!.mass]);
    this.body.applyForce(
      V(this.body.velocity).imul(-FRICTION * this.body.mass)
    );

    const diver = this.game?.entities.getById("diver") as Diver;

    if (diver) {
      const offset = diver.getPosition().isub(this.getPosition());
      const distance = offset.magnitude;

      if (distance < MAGNET_RADIUS) {
        const percent = ((MAGNET_RADIUS - distance) / MAGNET_RADIUS) ** 2;
        const force = percent * MAGNET_FORCE;
        this.body.applyForce(offset.inormalize().imul(force));
      }
    }
  }

  onBeginContact(other: Entity) {
    if (other instanceof Diver) {
      this.game?.addEntity(
        new SoundInstance(snd_bellPositive1, { gain: 0.05 })
      );
      this.game?.dispatch({ type: "pickupCollected", value: this.value });
      this.destroy();
    }
  }

  onRender(dt: number) {
    this.sprite!.position.set(...this.body!.position);
    this.sprite.update(dt);
  }
}
