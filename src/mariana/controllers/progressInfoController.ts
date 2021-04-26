import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import Game from "../../core/Game";

export interface UpgradeOptions {
  poon: number;
  flashlight?: number;
}

export class ProgressInfoController extends BaseEntity implements Entity {
  persistenceLevel = 1;
  id = "progressInfoController";
  data: Object;

  constructor() {
    super();
    this.data = { poon: 0, flashlight: 0 };
  }

  onAdd() {
    this.getFromLocalStorage();
  }

  getFromLocalStorage() {
    const store = window.localStorage;
    this.data = {
      poon: store.getItem("poon") || 0,
      flashlight: store.getItem("flashlight") || 0,
    };
    return this.data;
  }

  saveToLocalStorage(data: UpgradeOptions) {
  for (const [item, val] of Object.entries(data)) {
      window.localStorage.setItem(item, val);
    }
  }
}

export function getProgressInfoController(game: Game): ProgressInfoController {
  return game.entities!.getById(
    "progressInfoController"
  ) as ProgressInfoController;
}
