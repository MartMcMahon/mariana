import snd_smallweaponalt1 from "../../../resources/audio/weapons/smallweaponalt_1.flac";
import snd_smallweaponalt2 from "../../../resources/audio/weapons/smallweaponalt_2.flac";
import snd_smallweaponalt3 from "../../../resources/audio/weapons/smallweaponalt_3.flac";
import snd_smallweaponalt4 from "../../../resources/audio/weapons/smallweaponalt_4.flac";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { SoundInstance } from "../../core/sound/SoundInstance";
import { polarToVec } from "../../core/util/MathUtil";
import { rUniform } from "../../core/util/Random";
import { V2d } from "../../core/Vector";
import { Diver } from "../diver/Diver";
import { Bubble } from "../effects/Bubble";
import { ShuffleRing } from "../utils/ShuffleRing";
import { Harpoon } from "./Harpoon";
import { Tether } from "./Tether";

export const SIZE = 0.8; // Length in meters
const SHOOT_SPEED = 60; // meters / second
export const DAMPING = 0.07;

const HARPOON_SOUNDS = new ShuffleRing([
  snd_smallweaponalt1,
  snd_smallweaponalt2,
  snd_smallweaponalt3,
  snd_smallweaponalt4,
]);

export class HarpoonGun extends BaseEntity implements Entity {
  harpoon: Harpoon | undefined;
  tether: Tether | undefined;

  constructor(public diver: Diver) {
    super();
  }

  async shoot(direction: V2d) {
    if (!this.harpoon) {
      this.game?.dispatch({ type: "harpoonFired" });
      const velocity = direction.inormalize().imul(SHOOT_SPEED);
      this.harpoon = this.addChild(
        new Harpoon(
          this.diver.getPosition(),
          velocity.add(this.diver.body.velocity)
        )
      );
      this.game?.addEntity(
        new SoundInstance(HARPOON_SOUNDS.getNext(), {
          gain: 0.3,
        })
      );
      this.diver.body.applyImpulse(velocity.mul(-this.harpoon.body.mass));
      this.tether = this.addChild(new Tether(this.diver, this.harpoon));

      for (let i = 0; i < 20; i++) {
        const angle = direction.angle;
        this.game!.addEntity(
          new Bubble(
            this.diver
              .getPosition()
              .iadd([rUniform(-0.1, 0.1), rUniform(-0.1, -0.1)]),
            polarToVec(
              rUniform(angle - 0.25, angle + 0.25),
              rUniform(4, 8)
            ).iadd(this.diver.body.velocity),
            rUniform(0.1, 0.3)
          )
        );
      }
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
