import BaseEntity from "./entity/BaseEntity";
import Entity from "./entity/Entity";

/** Pauses and unpauses the game when visibility is lost. */
export default class AutoPauser extends BaseEntity implements Entity {
  pausable = false;
  persistenceLevel = 100;

  autoPaused: boolean = false;

  onAdd() {
    document.addEventListener("visibilitychange", this.onVisibilityChange);
  }

  onDestroy() {
    document.removeEventListener("visibilitychange", this.onVisibilityChange);
  }

  onVisibilityChange = () => {
    if (document.hidden) {
      if (!this.game!.paused) {
        this.game!.pause();
        this.autoPaused = true;
      }
    } else {
      if (this.autoPaused && this.game!.paused) {
        this.game!.unpause();
        this.autoPaused = false;
      }
    }
  };
}
