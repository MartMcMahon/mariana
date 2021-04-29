import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import Game from "../../core/Game";
import { loadMoney, loadUpgrades, saveUpgrades } from "./persistence";
import { isUpgradeId, UpgradeId, UPGRADES } from "./upgrades";

const MONEY_KEY = "money";
const UPGRADES_KEY = "upgradesPurchased";

// This keeps track of all our upgrades and money and stuff
export class UpgradeManager extends BaseEntity implements Entity {
  persistenceLevel = 1;
  id = "upgradeManager";

  money: number = 0;
  private upgradesPurchased: Set<UpgradeId>;

  constructor() {
    super();

    this.money = loadMoney();
    this.upgradesPurchased = loadUpgrades();
  }

  hasUpgrade(upgradeId: UpgradeId): boolean {
    return this.upgradesPurchased.has(upgradeId);
  }

  canBuyUpgrade(upgradeId: UpgradeId): boolean {
    const upgrade = UPGRADES[upgradeId];

    // you can't buy the same upgrade twice
    if (this.hasUpgrade(upgradeId)) {
      return false;
    }

    // make sure we can afford it
    if (this.money < upgrade.cost) {
      return false;
    }

    // And we've researched all its prerequisites
    for (const prerequisite of upgrade.prerequisites) {
      if (!this.hasUpgrade(prerequisite)) {
        return false;
      }
    }

    return true;
  }

  buyUpgrade(upgradeId: UpgradeId) {
    if (!this.canBuyUpgrade(upgradeId)) {
      throw new Error(`Cannot buy upgrade: ${upgradeId}`);
    }

    const upgrade = UPGRADES[upgradeId];

    this.money -= upgrade.cost;
    this.upgradesPurchased.add(upgradeId);

    saveUpgrades(this.upgradesPurchased);
  }

  handlers = {
    depositSouls: (event: { amount: number }) => {
      this.money += event.amount;
    },
  };
}

export function getUpgradeManager(game: Game): UpgradeManager {
  return game.entities!.getById("upgradeManager") as UpgradeManager;
}
