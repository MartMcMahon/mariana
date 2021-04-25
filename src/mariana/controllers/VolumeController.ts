import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import Game from "../../core/Game";
import { KeyCode } from "../../core/io/Keys";
import { clamp } from "../../core/util/MathUtil";

export const VOLUME_CONTROLLER_ID = "volume_controller";

export default class VolumeController extends BaseEntity implements Entity {
  id = VOLUME_CONTROLLER_ID;
  pausable = false;
  persistenceLevel = 2;

  private _muted!: boolean;
  private _volume!: number;

  constructor() {
    super();

    this.muted = localStorage.getItem("muted") === "true";
    const loadedVolume = parseInt(localStorage.getItem("volume") || "");
    if (!isNaN(loadedVolume) && loadedVolume >= 0) {
      console.log("volume loaded", loadedVolume);
      this.volume = clamp(loadedVolume);
    } else {
      console.log("bad volume loaded", loadedVolume);
      this.volume = 1;
    }
  }

  get muted(): boolean {
    return this._muted;
  }

  set muted(muted: boolean) {
    this._muted = muted;
    if (this.game) {
      this.game!.masterGain.gain.value = muted ? 0 : this.volume;
      localStorage.setItem("muted", muted ? "true" : "false");
      this.game!.dispatch({
        type: "muteChanged",
        muted: this._muted,
        volume: this._volume,
      });
    }
  }

  get volume() {
    return this._volume;
  }

  set volume(value: number) {
    if (!isNaN(value)) {
      this._volume = clamp(value);
      localStorage.setItem("volume", String(value));
      if (this.game) {
        this.game!.dispatch({
          type: "volumeChanged",
          muted: this._muted,
          volume: this._volume,
        });
      }
    }
  }

  onAdd(game: Game) {
    const gain = this._muted ? 0 : this._volume;
    game.masterGain.gain.value = gain;
  }

  handlers = {
    mute: () => {
      this.muted = true;
    },
    unMute: () => {
      this.muted = false;
    },
    toggleMute: () => {
      this.muted = !this._muted;
    },
    setVolume: ({ volume }: { volume: number }) => {
      this.volume = volume;
    },
  };

  onKeyDown(key: KeyCode) {
    if (key === "KeyM") {
      this.muted = !this._muted;
    }
  }
}

export function getVolumeController(game: Game): VolumeController {
  return game.entities.getById(VOLUME_CONTROLLER_ID) as VolumeController;
}
