import BaseEntity from "../entity/BaseEntity";
import Entity from "../entity/Entity";
import Game from "../Game";
import { getSoundBuffer, hasSoundBuffer, SoundName } from "../resources/sounds";
import { rUniform } from "../util/Random";

export interface SoundOptions {
  pan?: number;
  gain?: number;
  speed?: number;
  continuous?: boolean;
  randomStart?: boolean;
  reactToSlowMo?: boolean;
  persistenceLevel?: number;
  pauseable?: boolean;
  outnode?: () => AudioNode;
}

/**
 * Represents a currently playing sound.
 */
export class SoundInstance extends BaseEntity implements Entity {
  tags = ["sound"];
  public readonly continuous: boolean;
  public reactToSlowMo: boolean;

  private sourceNode!: AudioBufferSourceNode;
  private panNode!: StereoPannerNode;
  public gainNode!: GainNode;
  private _speed: number = 1.0;

  private elapsed: number = 0;
  private lastTick: number = 0;

  private paused: boolean = false;

  set speed(value: number) {
    this._speed = value;
    this.updatePlaybackRate();
  }

  get speed(): number {
    return this._speed;
  }

  set pan(value: number) {
    if (!this.game) {
      this.options.pan = value;
    } else {
      this.panNode.pan.value = value;
    }
  }

  get pan(): number {
    if (!this.game) {
      return this.options.pan ?? 0;
    } else {
      return this.panNode.pan.value;
    }
  }

  set gain(value: number) {
    if (!this.game) {
      this.options.gain = value;
    } else {
      this.gainNode.gain.value = value;
    }
  }

  get gain(): number {
    if (!this.game) {
      return this.options.gain ?? 1;
    } else {
      return this.gainNode.gain.value;
    }
  }

  private _promise: Promise<void>;
  private _resolve!: () => void;

  constructor(
    public readonly soundName: SoundName,
    private options: SoundOptions = {}
  ) {
    super();
    this.speed = options.speed ?? 1.0;
    this.continuous = options.continuous ?? false;
    this.reactToSlowMo = options.reactToSlowMo ?? true;
    this.persistenceLevel = options.persistenceLevel ?? 0;
    this.pausable = options.pauseable ?? true;

    if (!hasSoundBuffer(soundName)) {
      throw new Error(`Unloaded Sound ${soundName}`);
    }

    this._promise = new Promise((resolve) => {
      this._resolve = resolve;
    });
  }

  onAdd(game: Game) {
    const chain = this.makeChain(game);
    if (this.options.outnode) {
      chain.connect(this.options.outnode());
    } else {
      chain.connect(game.masterGain);
    }

    this.sourceNode.onended = () => {
      if (!this.paused) {
        this.destroy();
      }
    };

    this.lastTick = game.audio.currentTime;

    const startTime = this.options.randomStart
      ? rUniform(0, this.sourceNode.buffer!.duration * 0.99)
      : undefined;
    this.sourceNode.start(startTime);
  }

  makeChain({ audio, slowMo }: Game): AudioNode {
    this.sourceNode = audio.createBufferSource();
    this.sourceNode.buffer = getSoundBuffer(this.soundName)!;
    this.sourceNode.loop = this.continuous;
    if (this.reactToSlowMo) {
      this.sourceNode.playbackRate.value = this._speed * slowMo;
    } else {
      this.sourceNode.playbackRate.value = this._speed;
    }

    this.panNode = audio.createStereoPanner();
    this.panNode.pan.value = this.options.pan ?? 0.0;

    this.gainNode = audio.createGain();
    this.gainNode.gain.value = this.options.gain ?? 1.0;

    this.sourceNode.connect(this.panNode);
    this.panNode.connect(this.gainNode);
    return this.gainNode;
  }

  async waitTillEnded() {
    if (this.continuous) {
      throw new Error("Can't wait for end of continuous sound");
    }
    return this._promise;
  }

  onTick() {
    const now = this.game!.audio.currentTime;
    this.elapsed += (now - this.lastTick) * this.sourceNode.playbackRate.value;
    if (this.continuous) {
      this.elapsed = this.elapsed % this.sourceNode.buffer!.duration;
    }
    this.lastTick = now;
  }

  updatePlaybackRate() {
    if (this.sourceNode && this.game) {
      if (this.reactToSlowMo) {
        this.sourceNode.playbackRate.value = this._speed * this.game.slowMo;
      } else {
        this.sourceNode.playbackRate.value = this._speed;
      }
    }
  }

  handlers = {
    slowMoChanged: () => {
      this.updatePlaybackRate();
    },
  };

  pause() {
    if (this.pausable) {
      this.paused = true;
      this.sourceNode.onended = null;
      this.sourceNode.stop();
    }
  }

  unpause() {
    if (this.paused) {
      this.paused = false;
      const bufferDuration = this.sourceNode.buffer!.duration;
      if (!this.continuous && this.elapsed >= bufferDuration) {
        this.destroy();
      } else {
        this.restartSound(this.elapsed % bufferDuration);
      }
    }
  }

  restartSound(startTime: number) {
    this.sourceNode.disconnect();
    const newNode = this.game!.audio.createBufferSource();
    newNode.buffer = this.sourceNode.buffer;
    newNode.loop = this.sourceNode.loop;
    this.sourceNode = newNode;
    this.sourceNode.connect(this.panNode);
    this.sourceNode.start(this.game!.audio.currentTime, startTime);
  }

  jumpToRandom() {
    this.restartSound(rUniform(0, this.sourceNode.buffer!.duration * 0.99));
  }

  onPause() {
    this.pause();
  }

  onUnpause() {
    this.unpause();
  }

  onDestroy() {
    this.sourceNode.stop();
    this._resolve();
  }
}
