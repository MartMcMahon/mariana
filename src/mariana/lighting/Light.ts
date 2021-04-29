import { Sprite } from "pixi.js";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import Game from "../../core/Game";
import { getLightingManager } from "./LightingManager";

export class Light extends BaseEntity implements Entity {
  constructor(public lightSprite: Sprite) {
    super();
  }

  onAdd() {
    const lightingManager = getLightingManager(this.game);
    if (lightingManager) {
      lightingManager.addLight(this.lightSprite);
    }
  }

  onDestroy(game: Game) {
    const lightingManager = getLightingManager(game);
    if (lightingManager) {
      lightingManager.removeLight(this.lightSprite);
    }
  }
}
