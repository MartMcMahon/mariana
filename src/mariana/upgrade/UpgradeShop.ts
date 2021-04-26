import { Graphics, Sprite, Text } from "pixi.js";
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

export class UpgradeShop extends BaseEntity implements Entity {
  sprite: Sprite & GameSprite;
  savedData: UpgradeOptions;

  menuWidth: number;
  menuHeight: number;

  speedUpgrade: Text;
  oxygenUpgrade: Text;
  speedCost: number;
  oxygenCost: number;
  moneyText: Text;

  constructor(menuWidth = 400, menuHeight = 200) {
    super();
    this.sprite = new Sprite();
    this.sprite.layerName = Layer.MENU;

    this.savedData = { speed: 0, oxygen: 0 };
    this.menuWidth = window.innerWidth * 0.7;
    this.menuHeight = (window.innerHeight * 0.7) / 2;

    let background = new Graphics();
    background.beginFill(0xbbbbbb, 0.3);
    background.lineStyle(1, 0x000);
    background.drawRect(
      -this.menuWidth / 2,
      -this.menuHeight - this.menuHeight / 5,
      this.menuWidth,
      this.menuHeight
    );
    this.sprite.addChild(background);

    // 'poon
    // this.poonItem = AnimatedSprite.fromImages([img_harpoon]);
    // this.poonItem.position = V(-this.poonItem.width / 2, -this.menuHeight);
    // this.poonItem.scale.set(3, 3);
    // this.poonItem.anchor.set(0.5);
    // this.poonItem.interactive = true;
    // this.poonItem.click = () => {
    //   console.log("clicked the harpoon upgrade");
    // };
    // this.sprite.addChild(this.poonItem);

    // let poonItemBg = new Graphics()
    //   .beginFill(0, 0)
    //   .lineStyle(1, 0x000)
    //   .drawRect(-11, -11, 22, 22);
    // this.poonItem.addChild(poonItemBg);

    // enter to dive
    const text = new Text("Press space to dive", {
      fontFamily: "Montserrat Black",
      fontSize: 48,
      color: "white",
    });
    text.position = V(0, menuHeight / 2 - 20);
    this.sprite.addChild(text);
    text.anchor.set(0.5);

    // money text
    this.moneyText = new Text("🐟");
    this.moneyText.anchor.set(0.5);
    this.moneyText.position = V(0, -this.menuHeight * 0.9);
    this.moneyText.interactive = false;
    this.sprite.addChild(this.moneyText);

    // speed upgrade
    this.speedUpgrade = new Text("speed", { fontSize: 42 });
    this.speedUpgrade.anchor.set(0.5);
    this.speedUpgrade.position = V(0, -this.menuHeight * 0.7);
    this.speedUpgrade.interactive = true;
    this.sprite.addChild(this.speedUpgrade);

    // oxygen upgrade
    this.oxygenUpgrade = new Text("oxygen", { fontSize: 42 });
    this.oxygenUpgrade.anchor.set(0.5);
    this.oxygenUpgrade.position = V(0, -this.menuHeight / 2);
    this.oxygenUpgrade.interactive = true;
    this.sprite.addChild(this.oxygenUpgrade);
  }

  onAdd() {
    let controller = getUpgradeManager(this.game!);
    this.savedData = controller.getFromLocalStorage();

    // this.poonItemText = AnimatedSprite.fromImages([img_buy]);
    // this.poonItemText.position = V(
    //   -this.poonItem.width / 2 + 32,
    //   -this.menuHeight + 96
    // );
    // this.poonItemText.anchor.set(0.5);
    // this.poonItemText.scale.set(0.5, 0.5);
    // this.poonItemText.interactive = true;
    // this.poonItemText.click = () => {
    //   this.savedData.poon = 1;
    //   controller.saveToLocalStorage(this.savedData);
    //   this.poonItemText.destroy();
    // };

    this.speedUpgrade.click = () => {
      this.savedData.speed += 1;
      // controller.saveToLocalStorage(this.savedData);
      this.game?.dispatch({ type: "upgrade", payload: "speed" });
    };

    this.oxygenUpgrade.click = () => {
      this.savedData.oxygen += 1;
      // controller.saveToLocalStorage(this.savedData);
      this.game?.dispatch({ type: "upgrade", payload: "oxygen" });
    };
  }

  onRender() {
    let controller = getUpgradeManager(this.game!);
    this.speedCost = controller.data.speed * 10;
    this.oxygenCost = controller.data.oxygen * 10;
    this.speedUpgrade.text = `speed: ${controller.data.speed} ~ cost: ${this.speedCost}`;
    this.oxygenUpgrade.text = `oxygen: ${controller.data.oxygen} ~ cost: ${this.oxygenCost}`;
    this.moneyText.text = `🐟: ${controller.pointsAvailable}`;
  }

  onResize([width, height]: [number, number]) {
    this.sprite.position.set(width / 2, height / 2);
  }

  onKeyDown(keyCode: KeyCode) {
    if (keyCode === "Escape") {
      this.destroy();
    }
  }

  handlers = {
    diverJumped: () => {
      this.destroy();
    },
  };
}
