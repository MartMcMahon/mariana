import BaseEntity from "../core/entity/BaseEntity";
import Entity from "../core/entity/Entity";
import { ControllerButton } from "../core/io/Gamepad";
import { KeyCode } from "../core/io/Keys";
import { clamp } from "../core/util/MathUtil";
import { Diver } from "./Diver";

// Maps player inputs into things the diver can do
export class DiverController extends BaseEntity implements Entity {
  constructor(public diver: Diver) {
    super();
  }

  onTick() {
    const { io, camera } = this.game!;
    const moveDirection = io.getStick("left");

    if (io.keyIsDown("KeyS")) {
      moveDirection[1] += 1;
    }
    if (io.keyIsDown("KeyW")) {
      moveDirection[1] -= 1;
    }
    if (io.keyIsDown("KeyA")) {
      moveDirection[0] -= 1;
    }
    if (io.keyIsDown("KeyD")) {
      moveDirection[0] += 1;
    }

    // so we don't move faster on diagonals
    moveDirection.magnitude = clamp(moveDirection.magnitude, 0, 1);

    this.diver.moveDirection.set(moveDirection);

    if (io.usingGamepad) {
      this.diver.aimDirection.set(io.getStick("right"));
    } else {
      this.diver.aimDirection = camera
        .toWorld(io.mousePosition)
        .sub(this.diver.getPosition());
    }
  }

  onKeyDown(key: KeyCode) {
    switch (key) {
      case "Space": {
        this.diver.jump();
      }
    }
  }

  onMouseDown() {
    this.diver.shoot();
  }

  onMouseUp() {
    this.diver.retract();
  }

  onButtonDown(button: ControllerButton) {
    switch (button) {
      case ControllerButton.A:
        this.diver.jump();
      case ControllerButton.RT:
        this.diver.shoot();
    }
  }

  onButtonUp(button: ControllerButton) {
    switch (button) {
      case ControllerButton.RT:
        this.diver.retract();
    }
  }

  handlers = {
    diverDied: () => {
      this.destroy();
    },
  };
}
