/** */
interface Upgrade {
  name: string;
  description: string;
  cost: number;
  prerequisites: UpgradeId[];
}

// TODO: Find a way to not have to repeat these ids
export type UpgradeId = "flippers1" | "flippers2" | "air1" | "air2";

/** All the upgrades */
export const UPGRADES: Record<UpgradeId, Upgrade> = {
  flippers1: {
    name: "Flippers",
    description: "Swim faster",
    cost: 100,
    prerequisites: [],
  },
  flippers2: {
    name: "Flippers",
    description: "Swim faster",
    cost: 200,
    prerequisites: ["flippers1"],
  },
  air1: {
    name: "Air Tank",
    description: "Stay underwater for longer",
    cost: 100,
    prerequisites: [],
  },
  air2: {
    name: "Bigger Air Tank",
    description: "Holds more air",
    cost: 200,
    prerequisites: ["air1"],
  },
};

export function isUpgradeId(s: string): s is UpgradeId {
  return s in UPGRADES;
}
