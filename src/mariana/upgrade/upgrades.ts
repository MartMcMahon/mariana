/** */
interface Upgrade {
  name: string;
  description: string;
  cost: number;
  prerequisites: UpgradeId[];
  thumbnailUrl?: string;
}

export type UpgradeId =
  | "flippers1"
  | "flippers2"
  | "weightBelt"
  | "BCD"
  | "air1"
  | "air2"
  | "rebreather";

/** All the upgrades */
const UPGRADES: Record<UpgradeId, Upgrade> = {
  flippers1: {
    name: "Flippers",
    description: "Swim faster",
    cost: 100,
    prerequisites: [],
  },
  flippers2: {
    name: "Advanced Flippers",
    description: "Swim even faster",
    cost: 300,
    prerequisites: ["flippers1"],
  },
  weightBelt: {
    name: "Weight Belt",
    description: "Sink faster",
    cost: 50,
    prerequisites: [],
  },
  BCD: {
    name: "BCD",
    description: "Swim up faster",
    cost: 250,
    prerequisites: ["weightBelt"],
  },
  air1: {
    name: "Air Tank",
    description: "Stay underwater for longer",
    cost: 150,
    prerequisites: [],
  },
  air2: {
    name: "Bigger Air Tank",
    description: "Holds more air",
    cost: 300,
    prerequisites: ["air1"],
  },
  rebreather: {
    name: "Rebreather",
    description: "Blow fewer bubbles",
    cost: 800,
    prerequisites: ["air2"],
  },
};

export const UPGRADE_IDS: UpgradeId[] = Object.keys(UPGRADES) as UpgradeId[];

/** Returns the upgrade with the given ID */
export function getUpgrade(id: UpgradeId): Upgrade {
  return UPGRADES[id];
}

export function isUpgradeId(s: string): s is UpgradeId {
  return s in UPGRADES;
}
