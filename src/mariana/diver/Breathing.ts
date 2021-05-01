import snd_breatheIn1 from "../../../resources/audio/diver/breathe_in_1.flac";
import snd_breatheIn2 from "../../../resources/audio/diver/breathe_in_2.flac";
import snd_breatheOut1 from "../../../resources/audio/diver/breathe_out_1.flac";
import snd_breatheOut2 from "../../../resources/audio/diver/breathe_out_2.flac";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { SoundInstance } from "../../core/sound/SoundInstance";
import { rBool, rNormal, rUniform } from "../../core/util/Random";
import { V } from "../../core/Vector";
import { Bubble } from "../effects/Bubble";
import { ShuffleRing } from "../utils/ShuffleRing";
import { Diver } from "./Diver";

const INHALE_SOUNDS = new ShuffleRing([snd_breatheIn1, snd_breatheIn2]);
const EXHALE_SOUNDS = new ShuffleRing([snd_breatheOut1, snd_breatheOut2]);

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
      if (this.diver.oxygenManager.currentOxygen <= 0) {
        // TODO: Suffocation sounds?
        await this.waitUntil(() => this.diver.oxygenManager.currentOxygen > 1);
      }

      this.game?.dispatch({ type: "breatheIn" });
      this.addChild(new SoundInstance(INHALE_SOUNDS.getNext(), { gain: 0.1 }));
      await this.wait(this.cadence);
    }
    this.breatheOut();
  }

  async breatheOut(pace = 1.0, amount: number = 1.0) {
    this.clearTimers();
    if (!this.diver.isSurfaced()) {
      this.addChild(new SoundInstance(EXHALE_SOUNDS.getNext(), { gain: 0.1 }));
      await this.wait(0.8 / pace, () => {
        if (rBool(0.7 * pace)) {
          this.game!.addEntity(
            new Bubble(
              this.diver
                .getPosition()
                .iadd([rUniform(-0.5, 0.5), rUniform(-0.5, -0.9)]),
              V(this.diver.body.velocity).iadd([rNormal(0, 3), rNormal(0, 3)]),
              rUniform(0.1, 0.5) * amount * pace
            )
          );
        }
      });
    }
    await this.wait(this.cadence / pace - this.exhaleDuration);
    this.breatheIn();
  }

  handlers = {
    diverHurt: ({ amount }: { amount: number }) => {
      this.breatheOut(1.7, (amount / 20) ** 0.5 / 2);
    },
  };
}
