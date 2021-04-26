import { Sprite } from "pixi.js";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../core/entity/Entity";

export class FishCounter extends BaseEntity implements Entity {
  sprite: Sprite & GameSprite;

  constructor() {
    super();

    this.sprite = new Sprite();
    this.sprite.anchor(0, 1);
  }

  onResize([width, height]: V2d) {
    this.sprite!.x = width - WIDTH;
    this.sprite!.y = height - HEIGHT;
  }

  onRender() {}
}
