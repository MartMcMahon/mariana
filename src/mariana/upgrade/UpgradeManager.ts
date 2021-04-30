import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import Game from "../../core/Game";
import { loadMoney, loadUpgrades, saveUpgrades } from "./persistence";
import { getUpgrade, UpgradeId, UPGRADE_IDS } from "./upgrades";

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
    return (
      !this.hasUpgrade(upgradeId) &&
      this.canAffordUpgrade(upgradeId) &&
      this.hasPrerequisites(upgradeId)
    );
  }

  canAffordUpgrade(upgradeId: UpgradeId): boolean {
    return this.money >= getUpgrade(upgradeId).cost;
  }

  hasPrerequisites(upgradeId: UpgradeId): boolean {
    for (const prerequisite of getUpgrade(upgradeId).prerequisites) {
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

    const upgrade = getUpgrade(upgradeId);

    this.money -= upgrade.cost;
    this.upgradesPurchased.add(upgradeId);

    saveUpgrades(this.upgradesPurchased);

    this.game?.dispatch({ type: "upgradeBought", upgradeId });
  }

  getAvailableUpgrades(): UpgradeId[] {
    return UPGRADE_IDS.filter(
      (u) => !this.hasUpgrade(u) && this.hasPrerequisites(u)
    );
  }

  handlers = {
    depositSouls: (event: { amount: number }) => {
      this.money += event.amount;
    },

    buyUpgrade: (event: { upgradeId: UpgradeId }) => {
      this.buyUpgrade(event.upgradeId);
    },
  };
}

export function getUpgradeManager(game: Game): UpgradeManager {
  return game.entities!.getById("upgradeManager") as UpgradeManager;
}
