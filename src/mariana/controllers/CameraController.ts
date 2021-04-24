import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { Camera2d } from "../../core/graphics/Camera2d";
import PositionalSoundListener from "../../core/sound/PositionalSoundListener";
import { V } from "../../core/Vector";
import { Persistence } from "../constants/constants";
import PartyManager from "../environment/PartyManager";
import Human from "../human/Human";

export default class CameraController extends BaseEntity implements Entity {
  persistenceLevel = Persistence.Game;

  constructor(
    private camera: Camera2d,
    private getPlayer: () => Human | undefined
  ) {
    super();
  }

  onAdd() {
    this.camera.z = 65;
  }

  onRender() {
    const player = this.getPlayer();
    if (player) {
      this.camera.smoothCenter(player.getPosition());
    } else {
      this.camera.smoothSetVelocity(V(0, 0));
    }

    this.getListener().setPosition(this.camera.position);

    if (this.game?.io.keyIsDown("Equal")) {
      this.camera.z *= 1.01;
    }
    if (this.game?.io.keyIsDown("Minus")) {
      this.camera.z *= 0.99;
    }
  }

  getListener(): PositionalSoundListener {
    return this.game!.entities.getById(
      "positional_sound_listener"
    ) as PositionalSoundListener;
  }

  onInputDeviceChange(usingGamepad: boolean) {
    if (usingGamepad) {
      this.game?.renderer.hideCursor();
    } else {
      this.game?.renderer.setCursor("crosshair");
    }
  }
}
