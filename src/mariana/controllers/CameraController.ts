import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { Camera2d } from "../../core/graphics/Camera2d";
import PositionalSoundListener from "../../core/sound/PositionalSoundListener";
import { V } from "../../core/Vector";

export default class CameraController extends BaseEntity implements Entity {
  constructor(private camera: Camera2d) {
    super();
  }

  onAdd() {
    this.camera.z = 65;
  }

  onRender() {}

  onInputDeviceChange(usingGamepad: boolean) {
    if (usingGamepad) {
      this.game?.renderer.hideCursor();
    } else {
      this.game?.renderer.setCursor("crosshair");
    }
  }
}
