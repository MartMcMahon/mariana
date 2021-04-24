import { Sprite, Text } from "pixi.js";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { LayerInfo } from "../../core/graphics/LayerInfo";
import { KeyCode } from "../../core/io/Keys";
import { Layer } from "../config/layers";

export class UpgradeShop extends BaseEntity implements Entity {
  sprite: Sprite & GameSprite;

  constructor() {
    super();

    this.sprite = new Sprite();
    this.sprite.layerName = Layer.MENU;

    const text = new Text("Press enter to dive", {
      fontSize: 48,
      color: "white",
    });
    this.sprite.addChild(text);
    text.anchor.set(0.5);
  }

  onResize([width, height]: [number, number]) {
    this.sprite.position.set(width / 2, height / 2);
  }

  onKeyDown(keyCode: KeyCode) {
    if (keyCode === "Enter") {
      this.game?.dispatch({ type: "diveStart" });
      this.destroy();
    }
  }
}
