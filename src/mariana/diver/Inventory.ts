import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { Boat } from "../Boat";
import { makeSoulDrops } from "../FishSoul";
import { Diver } from "./Diver";

export class Inventory extends BaseEntity implements Entity {
  fishSouls: number = 0;

  constructor(public diver: Diver) {
    super();
  }

  onTick(dt: number) {
    const boat = this.game!.entities.getById("boat") as Boat;

    if (boat.diverIsPresent()) {
      this.game?.dispatch({ type: "depositSouls", amount: this.fishSouls });
      this.fishSouls = 0;
    }
  }

  handlers = {
    diverDied: () => {
      const center = this.diver.getPosition();
      makeSoulDrops(center, this.fishSouls);
    },
  };
}
