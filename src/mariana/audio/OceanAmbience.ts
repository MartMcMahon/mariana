import snd_oceanTexture from "../../../resources/audio/ocean_texture.wav";
import snd_spookySinking from "../../../resources/audio/spooky_sinking.flac";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import Game from "../../core/Game";
import { SoundInstance } from "../../core/sound/SoundInstance";
import { clamp, lerp, smoothStep } from "../../core/util/MathUtil";
import { Diver } from "../Diver";

const WAVES_CUTOFF_HIGH = 250;
const WAVES_CUTOFF_LOW = 100;
const WAVES_CUTOFF_SURFACE = 22050;
const SPOOKY_START_DEPTH = 20;
const SPOOKY_RAMP_DISTANCE = 30;

// This is the manager for all the long-running sounds
export class OceanAmbience extends BaseEntity implements Entity {
  persistenceLevel = 1;
  waveSounds: WaveSounds;
  spookySinking: SpookySounds;

  constructor() {
    super();

    this.waveSounds = this.addChild(new WaveSounds());

    this.spookySinking = this.addChild(new SpookySounds());
    this.spookySinking.gain = 0;
  }

  onTick() {
    const diver = this.game!.entities.getById("diver") as Diver;
    const depth = diver?.getDepth() ?? 0;

    const t = this.game!.audio.currentTime;
    const speed = 0.12;
    if (depth > 0) {
      // below water
      const target = lerp(
        WAVES_CUTOFF_HIGH,
        WAVES_CUTOFF_LOW,
        smoothStep(clamp(depth / 80))
      );
      this.waveSounds.filter.frequency.setTargetAtTime(target, t, speed);
      this.waveSounds.gainNode.gain.setTargetAtTime(0.2, t, speed);
    } else {
      // above water
      this.waveSounds.filter.frequency.setTargetAtTime(
        WAVES_CUTOFF_SURFACE,
        t,
        speed * 20 // cuz exponential ramp is going the wrong way
      );
      this.waveSounds.gainNode.gain.setTargetAtTime(0.07, t, speed);
    }

    this.spookySinking.gain = lerp(
      0,
      0.5,
      clamp((depth - SPOOKY_START_DEPTH) / SPOOKY_RAMP_DISTANCE)
    );
  }
}

class WaveSounds extends SoundInstance {
  filter!: BiquadFilterNode;

  constructor() {
    super(snd_oceanTexture, {
      pauseable: false,
      continuous: true,
      gain: 0,
      // randomStart: true,
    });
  }

  makeChain(game: Game) {
    const chain = super.makeChain(game);
    const audio = game.audio;
    this.filter = audio.createBiquadFilter();
    this.filter.type = "lowpass";
    this.filter.frequency.setValueAtTime(22050, audio.currentTime);
    this.filter.Q.value = 8.0;

    chain.connect(this.filter);

    return this.filter;
  }
}

class SpookySounds extends SoundInstance {
  filter!: BiquadFilterNode;

  constructor() {
    super(snd_spookySinking, { pauseable: false, continuous: true, gain: 0.3 });
  }

  makeChain(game: Game) {
    const audio = game.audio;
    const chain = super.makeChain(game);
    this.filter = audio.createBiquadFilter();
    this.filter.Q.value = 8.0;
    chain.connect(this.filter);
    return this.filter;
  }
}
