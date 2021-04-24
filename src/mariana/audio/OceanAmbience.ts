import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";

export class OceanAmbience extends BaseEntity implements Entity {
  constructor() {
    super();
  }

  onTick() {
    const diver = this.game?.entities.getById("diver");
  }
}
