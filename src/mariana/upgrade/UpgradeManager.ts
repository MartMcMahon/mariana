import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";

export class UpgradeManager extends BaseEntity implements Entity {
  id = "upgradeManager";

  pointsAvailable: number = 0;

  constructor() {
    super();
  }

  handlers = {
    diveEnd: () => {
      this.pointsAvailable += 100;
    },
  };
}
