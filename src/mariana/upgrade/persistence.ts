import { isUpgradeId, UpgradeId } from "./upgrades";

// Keys for localStorage. Be careful, changing these values will wipe out saved data.
const MONEY_KEY = "money";
const UPGRADES_KEY = "upgradesPurchased";

export function loadMoney(): number {
  const storedPoints = parseInt(window.localStorage.getItem(MONEY_KEY) ?? "");

  if (isNaN(storedPoints)) {
    return 0;
  } else {
    return storedPoints;
  }
}

export function saveMoney(money: number) {
  window.localStorage.setItem(MONEY_KEY, String(money));
}

export function loadUpgrades(): Set<UpgradeId> {
  const rawValue = window.localStorage.getItem("upgradePointsAvailable") ?? "";

  const upgradesPurchased = new Set<UpgradeId>();

  for (const maybeUpgradeId of rawValue.split(",")) {
    if (isUpgradeId(maybeUpgradeId)) {
      upgradesPurchased.add(maybeUpgradeId);
    }
  }
  return upgradesPurchased;
}

export function saveUpgrades(upgrades: Iterable<UpgradeId>) {
  window.localStorage.setItem(UPGRADES_KEY, [...upgrades].join(","));
}
