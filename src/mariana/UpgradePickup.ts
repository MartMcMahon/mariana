import BaseEntity from "../core/entity/BaseEntity";
import Entity from "../core/entity/Entity";
import { V2d } from "../core/Vector";

export class UpgradePickup extends BaseEntity implements Entity {
  constructor(position: V2d, public value: number = 1) {
    super();
  }
}
