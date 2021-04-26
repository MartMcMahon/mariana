import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { stepToward } from "../../core/util/MathUtil";
import { rBool } from "../../core/util/Random";
import { Diver } from "./Diver";

export const HARPOON_OXYGEN_COST = 5;
export const SUFFOCATION_TIME = 10; // seconds without breathing to die
export const DEPTH_BREATH_FACTOR = 0.1; // extra oxygen per meter

// Keeps track of how much oxygen there is, and kills the player when there's not enough (TODO:)
export class OxygenManager extends BaseEntity implements Entity {
  maxOxygen = 100; // each point is approximately one breath at the surface
  currentOxygen = this.maxOxygen;
  fillRate = 20;
  suffocationPercent = 0;

  constructor(private diver: Diver) {
    super();
  }

  handlers = {
    breatheIn: () => {
      const depth = this.diver.getDepth();
      const amount = 1 + depth * DEPTH_BREATH_FACTOR;

      this.useOxygen(amount);
    },

    harpoonFired: () => {
      this.useOxygen(HARPOON_OXYGEN_COST);
    },

    diverHurt: ({ amount }: { amount: number }) => {
      this.useOxygen(amount / 2);
    },
  };

  useOxygen(amount: number) {
    this.currentOxygen -= amount;

    if (this.currentOxygen < 0) {
      this.suffocationPercent += -this.currentOxygen / 100;
      this.currentOxygen = 0;
    }
  }

  giveOxygen(amount: number) {
    this.currentOxygen = Math.min(this.currentOxygen + amount, this.maxOxygen);
  }

  getOxygenPercent() {
    return this.currentOxygen / this.maxOxygen;
  }

  onTick(dt: number) {
    if (this.game?.io.keyIsDown("KeyB")) {
      this.useOxygen(0.2);
    }
    if (this.diver.isSurfaced()) {
      this.giveOxygen(dt * this.fillRate);
    }

    if (this.currentOxygen <= 0) {
      this.suffocationPercent = stepToward(
        this.suffocationPercent,
        1,
        dt / SUFFOCATION_TIME
      );
    } else {
      this.suffocationPercent = stepToward(
        this.suffocationPercent,
        0,
        dt * 0.5
      );
    }

    if (this.suffocationPercent >= 1 && !this.diver.isDead) {
      console.log("diver suffocated");
      this.game?.dispatch({ type: "diverDied" });
    }
  }
}
