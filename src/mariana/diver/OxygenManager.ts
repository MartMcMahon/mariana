import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { Diver } from "./Diver";

export const HARPOON_OXYGEN_COST = 5;
export const SUFFOCATION_DAMAGE = 20;

// Keeps track of how much oxygen there is, and kills the player when there's not enough (TODO:)
export class OxygenManager extends BaseEntity implements Entity {
  maxOxygen = 100; // each point is approximately one breath at the surface
  currentOxygen = this.maxOxygen;
  fillRate = 20;

  constructor(private getDiver: () => Diver) {
    super();
  }

  handlers = {
    breatheIn: () => {
      const diver = this.getDiver();
      const depth = diver.getDepth();
      const amount = (depth + 10) / 10;
      if (this.currentOxygen < amount) {
        diver.damage((amount - this.currentOxygen) * SUFFOCATION_DAMAGE);
      }

      this.useOxygen(amount);
    },

    harpoonFired: () => {
      this.useOxygen(HARPOON_OXYGEN_COST);
    },
  };

  useOxygen(amount: number) {
    this.currentOxygen = Math.max(this.currentOxygen - amount, 0);
  }

  giveOxygen(amount: number) {
    this.currentOxygen = Math.min(this.currentOxygen + amount, this.maxOxygen);
  }

  getOxygenPercent() {
    return this.currentOxygen / this.maxOxygen;
  }

  onTick(dt: number) {
    const diver = this.getDiver();
    if (diver.isSurfaced()) {
      this.giveOxygen(dt * this.fillRate);
    }
  }
}
