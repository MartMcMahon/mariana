import snd_smallweapon1 from "../../../resources/audio/smallweapon1.flac";
import snd_smallweapon2 from "../../../resources/audio/smallweapon2.flac";
import snd_smallweapon3 from "../../../resources/audio/smallweapon3.flac";
import snd_smallweapon4 from "../../../resources/audio/smallweapon4.flac";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { SoundInstance } from "../../core/sound/SoundInstance";
import { V2d } from "../../core/Vector";
import { Diver } from "../Diver";
import { ShuffleRing } from "../utils/ShuffleRing";
import { Harpoon } from "./Harpoon";
import { Tether } from "./Tether";

export const SIZE = 2.0; // Length in meters
const SHOOT_SPEED = 65; // meters / second
export const DAMPING = 0.085;

export const SOUND_RING = new ShuffleRing([
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
      this.game?.addEntity(
        new SoundInstance(SOUND_RING.getNext(), {
          gain: 0.3,
        })
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
