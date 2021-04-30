import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { rBool } from "../../core/util/Random";
import { Boat } from "../Boat";
import { makeSoulDrops } from "../FishSoul";
import { Diver } from "./Diver";
import { FishSoulTransfer } from "./FishSoulTransfer";

export class Inventory extends BaseEntity implements Entity {
  fishSouls: number = 0;

  constructor(public diver: Diver) {
    super();
  }

  onTick(dt: number) {
    const boat = this.game!.entities.getById("boat") as Boat;

    if (
      boat.diverWithinDropoffRange() &&
      this.fishSouls > 0 &&
      this.game!.ticknumber % 4 === 0
    ) {
      this.transferSouls(Math.ceil(this.fishSouls / 10));
    }

    if (
      process.env.NODE_ENV === "development" &&
      this.game!.io.keyIsDown("KeyF")
    ) {
      this.fishSouls += 1;
    }
  }

  transferSouls(value: number) {
    this.game!.addEntity(new FishSoulTransfer(this.diver.getPosition(), value));
    this.fishSouls -= value;
  }

  handlers = {
    diverDied: () => {
      const center = this.diver.getPosition();
      makeSoulDrops(center, this.fishSouls);
      this.fishSouls = 0;
    },

    fishSoulCollected: ({ value }: { value: number }) => {
      this.fishSouls += value;
    },
  };
}
