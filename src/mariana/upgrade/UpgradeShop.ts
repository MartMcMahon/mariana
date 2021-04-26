import { AnimatedSprite, Graphics, Sprite, Text } from "pixi.js";
import img_buy from "../../../resources/images/buy.png";
import img_harpoon from "../../../resources/images/harpoon.png";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { KeyCode } from "../../core/io/Keys";
import { V } from "../../core/Vector";
import { Layer } from "../config/layers";
import {ProgressInfoController} from "../controllers/progressInfoController";

const getFromLocalStorage = () => {
  const store = window.localStorage;
  return {
    poon: store.getItem("poon") || 0,
    flashlight: store.getItem("flashlight") || 0
  }
}

export class UpgradeShop extends BaseEntity implements Entity {
  sprite: Sprite & GameSprite;

  constructor(menuWidth = 400, menuHeight = 300) {
    super();
    this.sprite = new Sprite();
    this.sprite.layerName = Layer.MENU;

    let saved_upgrades = getFromLocalStorage();
    let points = this.game?.entities.getById("upgradeManager")?.pointsAvailable!;
    console.log(points)

    let background = new Graphics();
    background.beginFill(0xbbbbbb, 0.3);
    background.lineStyle(1, 0x000);
    background.drawRect(-menuWidth / 2, -menuHeight / 2, menuWidth, menuHeight);
    this.sprite.addChild(background);

    // 'poon
    let harpoonItem = AnimatedSprite.fromImages([img_harpoon]);
    harpoonItem.scale.set(3, 3);
    harpoonItem.position = V(-harpoonItem.width / 2, -harpoonItem.height / 2);
    harpoonItem.interactive = true;
    harpoonItem.click = () => {
      console.log("clicked the harpoon upgrade!");
    };
    this.sprite.addChild(harpoonItem);

    let harpoonItemBg = new Graphics()
      .beginFill(0, 0)
      .lineStyle(1, 0x000)
      .drawRect(0, 0, 22, 22);
    harpoonItem.addChild(harpoonItemBg);

    console.log(saved_upgrades.poon)
    if (saved_upgrades.poon === 0 ) {
      let harpoonItemText = AnimatedSprite.fromImages([img_buy]);
      harpoonItemText.position = V(
        -harpoonItem.width / 2,
        -harpoonItem.height / 2 + 96
      );
      harpoonItemText.scale.set(0.5, 0.5);
      harpoonItemText.interactive = true;
      harpoonItemText.click = () => {
        console.log("clicked text");
        window.localStorage.setItem("poon", 1)
      };
      this.sprite.addChild(harpoonItemText);
    }

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
      this.destroy();
    }
  }
}
