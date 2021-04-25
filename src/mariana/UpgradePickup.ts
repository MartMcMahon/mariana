import { Body, Particle } from "p2";
import { AnimatedSprite } from "pixi.js";
import img_pickup1 from "../../resources/images/pickup-1.png";
import img_pickup2 from "../../resources/images/pickup-2.png";
import img_pickup4 from "../../resources/images/pickup-4.png";
import img_pickup5 from "../../resources/images/pickup-5.png";
import img_pickup6 from "../../resources/images/pickup-6.png";
import img_pickup7 from "../../resources/images/pickup-7.png";
import BaseEntity from "../core/entity/BaseEntity";
import Entity from "../core/entity/Entity";
import { V2d } from "../core/Vector";
import { Diver } from "./Diver";

const MAGNET_DISTANCE = 3.5;
const MAGNET_FORCE = 200;
const GRAVITY = 3; // meters / sec^2
const LINEAR_DAMPING = 0.08; // meters / sec^2

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

    this.body = new Body({ mass: 0.2, fixedRotation: true, position });
    this.body.addShape(new Particle());

    this.sprite.width = this.sprite.height = 0.5 + Math.sqrt(value) * 0.1;

    this.sprite.animationSpeed = 8;

    console.log("pickup added");
  }

  onTick() {
    this.body.applyForce([0, GRAVITY * this.body!.mass]);
    this.body.applyDamping(LINEAR_DAMPING);

    const diver = this.game?.entities.getById("diver") as Diver;

    if (diver) {
      const offset = diver.getPosition().isub(this.getPosition());
      const distance = offset.magnitude;

      if (distance < MAGNET_DISTANCE) {
        const percent = (MAGNET_DISTANCE - distance) / MAGNET_DISTANCE;
        const force = percent * MAGNET_FORCE;
        this.body.applyForce(offset.normalize(force));
      }
    }
  }

  onBeginContact(other: Entity) {
    if (other instanceof Diver) {
      console.log("pickup collected");
      this.game?.dispatch({ type: "pickupCollected", value: this.value });
      this.destroy();
    }
  }

  onRender(dt: number) {
    this.sprite!.position.set(...this.body!.position);
    this.sprite.update(dt);
  }
}
