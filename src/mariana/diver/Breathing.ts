import snd_breatheIn1 from "../../../resources/audio/breathe_in_1.flac";
import snd_breatheOut1 from "../../../resources/audio/breathe_out_1.flac";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { SoundInstance } from "../../core/sound/SoundInstance";
import { rBool, rNormal, rUniform } from "../../core/util/Random";
import { V } from "../../core/Vector";
import { Bubble } from "../effects/Bubble";
import { Diver } from "./Diver";

// Controls the tempo of breathing, playing sounds, creating bubbles, etc.
export class BreatheEffect extends BaseEntity implements Entity {
  cadence = 3.4; // seconds between breaths
  exhaleDuration = 0.8; // seconds of exhaling

  constructor(public diver: Diver) {
    super();
  }

  async onAdd() {
    await this.wait(1.0);
    this.breatheOut();
  }

  async breatheIn() {
    this.clearTimers();
    if (!this.diver.isSurfaced()) {
      this.game?.dispatch({ type: "breatheIn" });
      this.addChild(new SoundInstance(snd_breatheIn1, { gain: 0.1 }));
      await this.wait(this.cadence);
    }
    this.breatheOut();
  }

  async breatheOut(pace = 1.0) {
    this.clearTimers();
    if (!this.diver.isSurfaced()) {
      this.addChild(new SoundInstance(snd_breatheOut1, { gain: 0.1 }));
      await this.wait(0.8 / pace, () => {
        if (rBool(0.7 * pace)) {
          this.game!.addEntity(
            new Bubble(
              this.diver
                .getPosition()
                .iadd([rUniform(-0.5, 0.5), rUniform(-0.5, -0.9)]),
              V(this.diver.body.velocity).iadd([rNormal(0, 3), rNormal(0, 3)]),
              rUniform(0.1, 0.5)
            )
          );
        }
      });
    }
    await this.wait(this.cadence / pace - this.exhaleDuration);
    this.breatheIn();
  }

  handlers = {
    diverHurt: () => {
      this.breatheOut(1.7);
    },
  };
}
