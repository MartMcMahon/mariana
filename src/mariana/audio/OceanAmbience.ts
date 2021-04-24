import snd_oceanTexture from "../../../resources/audio/ocean_texture.wav";
import Game from "../../core/Game";
import { SoundInstance } from "../../core/sound/SoundInstance";
import { Diver } from "../Diver";

export class OceanAmbience extends SoundInstance {
  filter!: BiquadFilterNode;

  constructor() {
    super(snd_oceanTexture, { pauseable: false, continuous: true, gain: 0.3 });
  }

  makeChain(game: Game) {
    const audio = game.audio;
    const chain = super.makeChain(game);
    this.filter = audio.createBiquadFilter();
    this.filter.Q.value = 2.0;

    chain.connect(this.filter);

    return this.filter;
  }

  onTick() {
    const diver = this.game!.entities.getById("diver") as Diver;
    if (!diver.isSurfaced()) {
      this.filter.frequency.value = 250;
    } else {
      this.filter.frequency.value = 100000;
    }
  }
}
