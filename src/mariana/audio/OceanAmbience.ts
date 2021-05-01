import snd_splash from "../../../resources/audio/impacts/splash.flac";
import snd_aboveWaterMusic from "../../../resources/audio/music-and-ambience/above_water_music.flac";
import snd_oceanTexture from "../../../resources/audio/music-and-ambience/ocean_texture.flac";
import snd_spookySinking from "../../../resources/audio/music-and-ambience/spooky_sinking.flac";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { SoundInstance } from "../../core/sound/SoundInstance";
import { clamp, lerp, smoothStep } from "../../core/util/MathUtil";
import { Diver, getDiver } from "../diver/Diver";

const CUTOFF_HIGH = 250;
const CUTOFF_LOW = 100;
const CUTOFF_SURFACE = 22050;

const SURFACE_MUSIC_VOLUME = 0.3;
const SURFACE_END_DEPTH = 15;
const SURFACE_RAMP = 50;

const SPOOKY_MUSIC_VOLUME = 0.4;
const SPOOKY_START_DEPTH = 20;
const SPOOKY_RAMP = 30;

// This is the manager for all the long-running sounds
export class OceanAmbience extends BaseEntity implements Entity {
  persistenceLevel = 1;

  waveSounds: SoundInstance;
  spookySinking: SoundInstance;
  surfaceMusic: SoundInstance;

  wasAboveWater = true;
  filter!: BiquadFilterNode;
  gain!: GainNode;

  constructor() {
    super();

    this.waveSounds = this.addChild(
      new SoundInstance(snd_oceanTexture, {
        pauseable: false,
        continuous: true,
        gain: 0,
        outnode: () => this.filter,
      })
    );

    this.spookySinking = this.addChild(
      new SoundInstance(snd_spookySinking, {
        pauseable: false,
        continuous: true,
        gain: 0,
        outnode: () => this.gain,
      })
    );

    this.surfaceMusic = this.addChild(
      new SoundInstance(snd_aboveWaterMusic, {
        pauseable: false,
        continuous: true,
        gain: SURFACE_MUSIC_VOLUME,
        outnode: () => this.gain,
      })
    );
  }

  onAdd() {
    this.filter = this.game!.audio.createBiquadFilter();
    this.filter.type = "lowpass";
    this.filter.frequency.setValueAtTime(22050, this.game!.audio.currentTime);
    this.filter.Q.value = 0.4;

    this.gain = this.game!.audio.createGain();

    this.filter.connect(this.gain);
    this.gain.connect(this.game!.masterGain);
  }

  handlers = {
    victory: () => {
      const t = this.game!.audio.currentTime;
      this.gain.gain.setTargetAtTime(0, t, 1);
    },

    diveStart: () => {
      const t = this.game!.audio.currentTime;
      this.gain.gain.setTargetAtTime(1, t, 1);
    },

    diverSubmerged: ({ diver }: { diver: Diver }) => {
      this.addChild(
        new SoundInstance(snd_splash, {
          gain: clamp(Math.abs((diver.body.velocity[1] ?? 0) / 10), 0, 0.7),
          outnode: () => this.filter,
        })
      );
    },

    diverSurfaced: ({ diver }: { diver: Diver }) => {
      this.addChild(
        new SoundInstance(snd_splash, {
          gain: clamp(Math.abs((diver.body.velocity[1] ?? 0) / 10), 0, 0.7),
          outnode: () => this.filter,
        })
      );
    },
  };

  onTick() {
    const diver = getDiver(this.game);
    const depth = diver?.getDepth() ?? 0;
    const isAboveWater = diver?.isSurfaced() ?? true;

    const t = this.game!.audio.currentTime;
    const speed = 0.12;

    if (isAboveWater) {
      // above water
      this.filter.frequency.setTargetAtTime(CUTOFF_SURFACE, t, speed * 20);
      this.waveSounds.gainNode.gain.setTargetAtTime(0.07, t, speed);
    } else {
      // below water
      const target = lerp(
        CUTOFF_HIGH,
        CUTOFF_LOW,
        smoothStep(clamp(depth / 80))
      );
      this.filter.frequency.setTargetAtTime(target, t, speed);
      this.waveSounds.gainNode.gain.setTargetAtTime(0.2, t, speed);
    }

    this.spookySinking.gain = lerp(
      0,
      SPOOKY_MUSIC_VOLUME,
      clamp((depth - SPOOKY_START_DEPTH) / SPOOKY_RAMP)
    );

    this.surfaceMusic.gain = lerp(
      SURFACE_MUSIC_VOLUME,
      0.0,
      clamp((depth - SURFACE_END_DEPTH) / SURFACE_RAMP)
    );

    this.wasAboveWater = isAboveWater;
  }
}
