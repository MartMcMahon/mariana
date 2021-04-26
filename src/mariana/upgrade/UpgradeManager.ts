import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import Game from "../../core/Game";

export interface UpgradeOptions {
  speed: number;
  oxygen: number;
}

export class UpgradeManager extends BaseEntity implements Entity {
  persistenceLevel = 1;
  id = "upgradeManager";
  data: Object;

  pointsAvailable: number = 0;

  constructor() {
    super();
    this.data = { speed: 0, oxygen: 0 };
  }

  onAdd() {
    this.getFromLocalStorage();
  }

  getFromLocalStorage() {
    const store = window.localStorage;
    this.data = {
      speed: parseInt(store.getItem("speed")) || 0,
      oxygen: parseInt(store.getItem("oxygen")) || 0,
      fishSouls: parseInt(store.getItem("fishSouls")) || 0,
    };
    return this.data;
  }

  saveToLocalStorage(data: UpgradeOptions) {
    for (const [item, val] of Object.entries(data)) {
      window.localStorage.setItem(item, val);
    }
  }

  handlers = {
    diveEnd: () => {
      this.pointsAvailable += 100;
    },
    depositSouls: (payload) => {
      this.pointsAvailable += payload.amount;
    },
    withdrawSouls: (payload) => {
      this.pointsAvailable -= payload.amount;
    },
  };
}

export function getUpgradeManager(game: Game): UpgradeManager {
  return game.entities!.getById("upgradeManager") as UpgradeManager;
}
