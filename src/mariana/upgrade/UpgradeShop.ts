import { AnimatedSprite, Graphics, Sprite, Text } from "pixi.js";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { LayerInfo } from "../../core/graphics/LayerInfo";
import { KeyCode } from "../../core/io/Keys";
import { Layer } from "../config/layers";
import { V, V2d } from "../../core/Vector";
import { Diver } from "../Diver";
import img_harpoon from "../../../resources/images/harpoon.png";

export class UpgradeShop extends BaseEntity implements Entity {
  sprite: Sprite & GameSprite;

  constructor(menuWidth = 800, menuHeight = 600) {
    super();
    this.sprite = new Sprite();
    this.sprite.layerName = Layer.MENU;

    let background = new Graphics();
    background.beginFill(0xbbbbbb, 0.3);
    background.lineStyle(1, 0x000);
    background.drawRect(
      -menuWidth / 2,
      -menuHeight / 2,
      menuWidth,
      menuHeight
    );
    this.sprite.addChild(background);

    // 'poon
    let poonItem = AnimatedSprite.fromImages([img_harpoon]);
    poonItem.scale.set(3, 3)
    poonItem.position = V(-menuWidth/2+32, -menuHeight/2+32)
    this.sprite.addChild(poonItem);
    poonItem.interactive = true;
    poonItem.click = function () {
      console.log("clicked the harpoon upgrade!");
    };
    let poonItemBg = new Graphics();
    poonItemBg.beginFill(0, 0);
    poonItemBg.lineStyle(1, 0x000);
    poonItemBg.drawRect(0, 0, 64, 64);
    poonItem.addChild(poonItemBg);

    // enter to dive
    const text = new Text("Press enter to dive", {
      fontSize: 48,
      color: "white",
    });
    text.position = V(0, menuHeight / 2 - 20);
    this.sprite.addChild(text);
    text.anchor.set(0.5);
  }

  onResize([width, height]: [number, number]) {
    this.sprite.position.set(width / 2, height / 2);
  }

  onKeyDown(keyCode: KeyCode) {
    if (keyCode === "Enter") {
      this.game?.dispatch({ type: "diveStart" });
      this.game?.entities
        .getById("progressInfoController")!
        .saveToLocalStorage();
      this.destroy();
    }
  }
}
