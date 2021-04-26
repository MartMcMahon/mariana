import { AnimatedSprite, Graphics, Sprite, Text } from "pixi.js";
import img_buy from "../../../resources/images/buy.png";
import img_harpoon from "../../../resources/images/harpoon.png";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { KeyCode } from "../../core/io/Keys";
import { V } from "../../core/Vector";
import { Layer } from "../config/layers";
import {
  getUpgradeManager,
  UpgradeManager,
  UpgradeOptions,
} from "./UpgradeManager";

// const getFromLocalStorage = () => {
//   const store = window.localStorage;
//   return {
//     poon: store.getItem("poon") || 0,
//     flashlight: store.getItem("flashlight") || 0,
//   };
// };

export class UpgradeShop extends BaseEntity implements Entity {
  sprite: Sprite & GameSprite;
  saved_upgrades: UpgradeOptions;
  poonItem: AnimatedSprite;

  poonItemText: AnimatedSprite;
  menuWidth: number;
  menuHeight: number;

  constructor(menuWidth = 400, menuHeight = 300) {
    super();
    this.sprite = new Sprite();
    this.sprite.layerName = Layer.MENU;

    this.saved_upgrades = { poon: 0 };
    this.menuWidth = window.innerWidth * 0.7;
    this.menuHeight = (window.innerHeight * 0.7) / 2;

    //     let background = new Graphics();
    //     background.beginFill(0xbbbbbb, 0.3);
    //     background.lineStyle(1, 0x000);
    //     background.drawRect(
    //       -menuWidth / 2,
    //       -menuHeight / 2 - menuHeight / 5,
    //       menuWidth,
    //       menuHeight
    //     );
    //     this.sprite.addChild(background);

    // 'poon
    this.poonItem = AnimatedSprite.fromImages([img_harpoon]);
    this.poonItem.position = V(-this.poonItem.width / 2, -this.menuHeight);
    this.poonItem.anchor.set(0.5);
    this.poonItem.scale.set(3, 3);
    this.poonItem.interactive = true;
    this.poonItem.click = () => {
      console.log("clicked the harpoon upgrade!");
    };
    this.sprite.addChild(this.poonItem);

    let poonItemBg = new Graphics()
      .beginFill(0, 0)
      .lineStyle(1, 0x000)
      .drawRect(-11, -11, 22, 22);
    this.poonItem.addChild(poonItemBg);

    // enter to dive
    const text = new Text("Press enter to dive", {
      fontSize: 48,
      color: "white",
    });
    text.position = V(0, menuHeight / 2 - 20);
    this.sprite.addChild(text);
    text.anchor.set(0.5);
  }

  onAdd() {
    let controller = getUpgradeManager(this.game!);
    this.saved_upgrades = controller.getFromLocalStorage();
    console.log("saved_upgrades", this.saved_upgrades);

    this.poonItemText = AnimatedSprite.fromImages([img_buy]);
    this.poonItemText.position = V(
      -this.poonItem.width / 2 + 32,
      -this.menuHeight + 96
    );
    this.poonItemText.anchor.set(0.5);
    this.poonItemText.scale.set(0.5, 0.5);
    this.poonItemText.interactive = true;
    this.poonItemText.click = () => {
      console.log("clicked text");
      this.saved_upgrades.poon = 1;
      controller.saveToLocalStorage(this.saved_upgrades);
      this.poonItemText.destroy();
    };
  }

  onRender() {
    if (this.saved_upgrades.poon === 0) {
      this.sprite.addChild(this.poonItemText);
    }
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
