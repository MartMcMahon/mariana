import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { Camera2d } from "../../core/graphics/Camera2d";
import { Diver } from "../diver/Diver";

export default class CameraController extends BaseEntity implements Entity {
  constructor(private camera: Camera2d, private diver: Diver) {
    super();
  }

  onAdd() {
    // Roughly corresponds to pixels per meter
    this.camera.z = 30;
  }

  onRender() {
    this.camera.smoothCenter(this.diver.getPosition());
  }

  onInputDeviceChange(usingGamepad: boolean) {
    if (usingGamepad) {
      this.game?.renderer.hideCursor();
    } else {
      this.game?.renderer.setCursor("crosshair");
    }
  }

  handlers = {
    diveEnd: () => {
      this.destroy();
    },
  };
}
