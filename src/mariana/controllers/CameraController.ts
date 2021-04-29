import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { Camera2d } from "../../core/graphics/Camera2d";
import { getPositionalSoundListener } from "../../core/sound/PositionalSoundListener";
import { clamp } from "../../core/util/MathUtil";
import { V } from "../../core/Vector";
import { Boat } from "../Boat";
import { WORLD_BOTTOM, WORLD_LEFT_EDGE, WORLD_RIGHT_EDGE } from "../constants";
import { getDiver } from "../diver/Diver";

export default class CameraController extends BaseEntity implements Entity {
  persistenceLevel = 1;

  constructor(private camera: Camera2d) {
    super();
  }

  onAdd() {
    // Roughly corresponds to pixels per meter
    this.camera.z = 30;
  }

  onRender() {
    const diver = getDiver(this.game);
    if (diver) {
      const [cameraWidth, cameraHeight] = this.camera.getViewportSize();

      const minX = WORLD_LEFT_EDGE + cameraWidth / this.camera.z / 2;
      const maxX = WORLD_RIGHT_EDGE - cameraWidth / this.camera.z / 2;
      const minY = -20;
      const maxY = WORLD_BOTTOM - cameraHeight / this.camera.z / 2;

      const [x, y] = diver.getPosition();
      this.camera.smoothCenter(V(clamp(x, minX, maxX), clamp(y, minY, maxY)));
    } else {
      const boat = this.game!.entities.getById("boat") as Boat;
      this.camera.smoothCenter(boat.getLaunchPosition());
    }

    const listener = getPositionalSoundListener(this.game);
    if (listener) {
      listener.setPosition(this.camera.position);
    }
  }

  onInputDeviceChange(usingGamepad: boolean) {
    if (usingGamepad) {
      this.game?.renderer.hideCursor();
    } else {
      this.game?.renderer.setCursor("crosshair");
    }
  }
}
