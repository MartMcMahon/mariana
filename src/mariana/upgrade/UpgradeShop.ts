import { Graphics, Sprite, Text, TextStyle } from "pixi.js";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { KeyCode } from "../../core/io/Keys";
import { FONT_HEADING } from "../fonts";

export class UpgradeShop extends BaseEntity implements Entity {
  sprite: Graphics & GameSprite;

  constructor() {
    super();

    this.sprite = new Graphics();
    this.sprite.beginFill(0xff0000);
    this.sprite.drawRect(0, 0, 500, 500);
    this.sprite.endFill();

    const jumpText = new Text("Press SPACE to dive", {
      fontFamily: FONT_HEADING,
      fontSize: 48,
      fill: "black",
      align: "center",
    } as Partial<TextStyle>);

    jumpText.anchor.set(0.5, 0);

    this.sprite.addChild(jumpText);
  }

  onResize([width, height]: [number, number]) {
    this.sprite!.x = width / 2;
  }

  handlers = {
    diverJumped: () => {
      this.destroy();
    },
  };
}

const UPGRADE_BUTTON_HEIGHT = 50;

class UpgradeButton extends BaseEntity implements Entity {
  constructor(index: number = 0) {
    super();

    this.sprite = new Sprite();
  }
}
