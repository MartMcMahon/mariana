import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import Game from "../../core/Game";

export class ProgressInfoController extends BaseEntity implements Entity {
  id = "progressInfoController";
  data = { upgrades: {} };

  constructor() {
    super();
    this.data = { upgrades: {} };
    this.getFromLocalStorage();
  }

  getFromLocalStorage() {
    this.data.upgrades = window.localStorage.getItem("upgrades") || {};
  }

  saveToLocalStorage() {
    window.localStorage.setItem("upgrades", this.data.upgrades);
  }
}

export function getPogressInfoController(game: Game): ProgressInfoController {
  return game.entities.getById(
    "progressInfoController"
  ) as ProgressInfoController;
}
