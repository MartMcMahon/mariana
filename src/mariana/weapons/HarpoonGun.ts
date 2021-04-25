import { Body, Box } from "p2";
import { Sprite } from "pixi.js";
import snd_smallweapon1 from "../../../resources/audio/smallweapon1.flac";
import snd_smallweapon2 from "../../../resources/audio/smallweapon2.flac";
import snd_smallweapon3 from "../../../resources/audio/smallweapon3.flac";
import snd_smallweapon4 from "../../../resources/audio/smallweapon4.flac";
import img_harpoon from "../../../resources/images/harpoon.png";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { SoundInstance } from "../../core/sound/SoundInstance";
import { V2d } from "../../core/Vector";
import { Diver } from "../Diver";
import { Jellyfish } from "../enemies/Jellyfish";
import { PufferFish } from "../enemies/PufferFish";
import { ShuffleRing } from "../utils/ShuffleRing";
import { Tether } from "./Tether";

const SIZE = 2.0; // Length in meters
const SHOOT_SPEED = 65; // meters / second
const DAMPING = 0.085;

const SOUND_RING = new ShuffleRing([
  snd_smallweapon1,
  snd_smallweapon2,
  snd_smallweapon3,
  snd_smallweapon4,
]);

export class HarpoonGun extends BaseEntity implements Entity {
  harpoon: Harpoon | undefined;
  tether: Tether | undefined;

  constructor(public diver: Diver) {
    super();
  }

  shoot(direction: V2d) {
    if (!this.harpoon) {
      const velocity = direction.normalize().imul(SHOOT_SPEED);
      this.harpoon = this.addChild(
        new Harpoon(this.diver.getPosition(), velocity)
      );
      this.diver.body.applyImpulse(velocity.mul(-this.harpoon.body.mass));
      this.tether = this.addChild(new Tether(this.diver, this.harpoon));
    } else {
      this.retract();
    }
  }

  async retract() {
    if (this.tether && !this.tether.retracting) {
      await this.tether.retract();
      this.tether.destroy();
      this.harpoon?.destroy();
      this.tether = undefined;
      this.harpoon = undefined;
    }
  }
}

class Harpoon extends BaseEntity implements Entity {
  body: Body;
  sprite: Sprite & GameSprite;

  constructor(public position: V2d, public velocity: V2d) {
    super();

    const sprite = (this.sprite = Sprite.from(img_harpoon));
    sprite.width = SIZE;
    sprite.height = SIZE;
    sprite.rotation = velocity.angle;
    sprite.anchor.set(0.5);

    this.body = new Body({
      mass: 0.03,
      collisionResponse: false,
      position,
    });
    this.body.addShape(new Box({ width: SIZE, height: 0.2 }));
    this.body.velocity = velocity;
    this.body.angle = velocity.angle;
    this.body.angularDamping = 0.12;
  }

  onAdd() {
    this.game?.addEntity(
      new SoundInstance(SOUND_RING.getNext(), {
        gain: 0.3,
      })
    );
  }

  onTick() {
    // gravity
    this.body.applyForce([0, 9.8 * this.body.mass]);
    this.body.applyDamping(DAMPING);
  }

  onRender() {
    this.sprite.position.set(...this.body!.position);
    this.sprite.rotation = this.body.angle - Math.PI / 4;
  }

  onBeginContact(other: Entity) {
    if (other instanceof Jellyfish || other instanceof PufferFish) {
      other.destroy();
    }
  }
}
