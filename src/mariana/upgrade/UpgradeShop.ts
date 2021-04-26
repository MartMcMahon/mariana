import { AnimatedSprite, Graphics, Sprite, Text, Texture } from "pixi.js";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { LayerInfo } from "../../core/graphics/LayerInfo";
import { KeyCode } from "../../core/io/Keys";
import { Layer } from "../config/layers";
import { V, V2d } from "../../core/Vector";
import { Diver } from "../diver/Diver";
import img_buy from "../../../resources/images/buy.png";
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
    background.drawRect(-menuWidth / 2, -menuHeight / 2, menuWidth, menuHeight);
    this.sprite.addChild(background);

    // 'poon
    let harpoonItem = AnimatedSprite.fromImages([img_harpoon]);
    harpoonItem.scale.set(2, 2);
    harpoonItem.position = V(-menuWidth / 2, -menuHeight / 2);
    harpoonItem.interactive = true;
    harpoonItem.click = () => {
      console.log("clicked the harpoon upgrade!");
    };
    this.sprite.addChild(harpoonItem);

    let harpoonItemBg = new Graphics()
      .beginFill(0, 0)
      .lineStyle(1, 0x000)
      .drawRect(0, 0, 30, 30);
    harpoonItem.addChild(harpoonItemBg);

    let harpoonItemText = AnimatedSprite.fromImages([img_buy]);
    harpoonItemText.position = V(-menuWidth / 2, -menuHeight / 2 + 64);
    harpoonItemText.scale.set(0.5, 0.5);
    harpoonItemText.interactive = true;
    harpoonItemText.click = () => {
      console.log("clicked text");
    };
    this.sprite.addChild(harpoonItemText);

    // flashlight
    let flashlightItem = AnimatedSprite.fromImages([img_harpoon]);
    flashlightItem.scale.set(2, 2);
    flashlightItem.position = V(-menuWidth / 2 + 64, -menuHeight / 2);
    flashlightItem.interactive = true;
    flashlightItem.click = () => {
      console.log("clicked the flashlight upgrade");
    };
    this.sprite.addChild(flashlightItem);
    let flashlightItemBg = new Graphics()
      .beginFill(0, 0)
      .lineStyle(1, 0)
      .drawRect(0, 0, 30, 30);
    flashlightItem.addChild(flashlightItemBg);
    let flashlightItemText = AnimatedSprite.fromImages([img_buy]);
    flashlightItemText.position = V(-menuWidth / 2 + 64, -menuHeight / 2 + 64);
    flashlightItemText.scale.set(0.5, 0.5);
    flashlightItemText.interactive = true;
    flashlightItemText.click = () => {
      console.log("buying flashlight");
    };
    this.sprite.addChild(flashlightItemText);

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
