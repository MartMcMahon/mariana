import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { Camera2d } from "../../core/graphics/Camera2d";
import { Boat } from "../Boat";
import { Diver } from "../diver/Diver";

export default class CameraController extends BaseEntity implements Entity {
  constructor(private camera: Camera2d) {
    super();
  }

  onAdd() {
    // Roughly corresponds to pixels per meter
    this.camera.z = 30;
  }

  onRender() {
    const diver = this.game!.entities.getById("diver") as Diver | undefined;
    if (diver) {
      this.camera.smoothCenter(diver.getPosition());
    } else {
      const boat = this.game!.entities.getById("boat") as Boat;
      this.camera.smoothCenter(V(boat.sprite.x, boat.sprite.y));
    }
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
