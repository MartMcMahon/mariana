import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { DirectionalLight } from "../lighting/DirectionalLight";
import { Diver } from "./Diver";

const ACTIVATION_DEPTH = 80;

export class Flashlight extends BaseEntity implements Entity {
  light: DirectionalLight;

  constructor(public diver: Diver) {
    super();

    this.light = this.addChild(
      new DirectionalLight({ length: 15, width: 10, intensity: 0.7 })
    );
  }

  onTick() {
    if (this.diver.getDepth() > ACTIVATION_DEPTH) {
      this.light.intensity = 1;
    } else {
      this.light.intensity = 0;
    }
  }

  onRender() {
    this.light.setPosition(this.diver.getPosition());
    this.light.rotation = this.diver.aimDirection.angle;
  }
}
