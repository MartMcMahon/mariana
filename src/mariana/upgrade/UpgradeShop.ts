import { Graphics, Sprite, Text, TextStyle } from "pixi.js";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../core/entity/Entity";
import Game from "../../core/Game";
import { Layer } from "../config/layers";
import { FONT_ALTERNATE, FONT_BODY, FONT_HEADING } from "../fonts";
import { getUpgradeManager } from "./UpgradeManager";
import { getUpgrade, UpgradeId } from "./upgrades";

const UPGRADE_BUTTON_HEIGHT = 100;
const PADDING = 4;

// TODO: Controller support
export class UpgradeShop extends BaseEntity implements Entity {
  sprite: Sprite & GameSprite;
  background: Graphics;
  jumpText: Text;
  moneyText: Text;

  upgradeButtons: UpgradeButton[] = [];

  constructor() {
    super();

    this.sprite = new Sprite();

    this.background = new Graphics();
    this.background.beginFill(0xffffff, 0.3);
    this.background.drawRect(0, 0, 500, 500);
    this.background.endFill();

    this.jumpText = new Text("Press SPACE to dive", {
      fontFamily: FONT_HEADING,
      fontSize: 48,
      fill: "black",
      align: "center",
    } as Partial<TextStyle>);
    this.jumpText.anchor.set(0.5, 0);

    this.moneyText = new Text(`$`, {
      fontFamily: FONT_HEADING,
      fontSize: 24,
      fill: "black",
      align: "right",
    } as Partial<TextStyle>);
    this.moneyText.anchor.set(1, 0);

    this.sprite.addChild(this.background);
    this.sprite.addChild(this.jumpText);
    this.sprite.addChild(this.moneyText);
    this.sprite.layerName = Layer.MENU;
  }

  onResize([width, height]: [number, number]) {
    this.background.width = width - 20;
    this.background.height = height - 100 - 20;
    this.background!.x = 10;
    this.background!.y = 10;

    this.jumpText.x = width / 2;
    this.jumpText.y = height - 100;

    this.moneyText.x = width - 10 - PADDING;
    this.moneyText.y = 10;
  }

  onAdd(game: Game) {
    this.resetUpgradeButtons();
  }

  onRender() {
    const upgradeManager = getUpgradeManager(this.game!);
    this.moneyText.text = `$${upgradeManager.money}`;
  }

  resetUpgradeButtons() {
    for (const button of this.upgradeButtons) {
      this.sprite.removeChild(button.buttonSprite);
      button.destroy();
    }
    this.upgradeButtons = [];

    const upgrades = getUpgradeManager(this.game!).getAvailableUpgrades();
    upgrades.sort((a, b) => getUpgrade(a).cost - getUpgrade(b).cost);
    for (const [i, upgrade] of upgrades.entries()) {
      const button = this.addChild(new UpgradeButton(upgrade, i));
      this.upgradeButtons.push(button);
      this.sprite.addChild(button.buttonSprite);
    }
  }

  handlers = {
    diverJumped: () => {
      this.destroy();
    },

    upgradeBought: () => {
      this.resetUpgradeButtons();
    },
  };
}

class UpgradeButton extends BaseEntity implements Entity {
  buttonSprite: Sprite;
  nameText: Text;
  descriptionText: Text;
  costText: Text;

  constructor(private upgradeId: UpgradeId, private index: number = 0) {
    super();

    const { cost, description, name } = getUpgrade(upgradeId);

    console.log(`UpgradeButton ${name}`);

    const width = 400;

    this.buttonSprite = new Sprite();
    this.buttonSprite.interactive = true;
    this.buttonSprite.x = 10 + PADDING;
    this.buttonSprite.y =
      10 + PADDING + index * (UPGRADE_BUTTON_HEIGHT + PADDING);

    const background = new Graphics();
    background.beginFill(0xffffff);
    background.drawRect(0, 0, width, UPGRADE_BUTTON_HEIGHT);
    background.endFill();
    background.alpha = 0.2;

    this.nameText = new Text(name, { fontFamily: FONT_HEADING, fontSize: 24 });
    this.nameText.position.set(5, 5);

    this.descriptionText = new Text(description, {
      fontFamily: FONT_BODY,
      fontSize: 16,
    });
    this.descriptionText.position.set(5, 30);

    this.costText = new Text(`$${cost}`, {
      fontFamily: FONT_ALTERNATE,
      fontSize: 16,
    });
    this.costText.anchor.set(1, 0);
    this.costText.position.set(width - 5, 5);

    this.buttonSprite.addChild(background);
    this.buttonSprite.addChild(this.nameText);
    this.buttonSprite.addChild(this.descriptionText);
    this.buttonSprite.addChild(this.costText);

    this.buttonSprite.addListener("click", () => {
      console.log("click");
      if (getUpgradeManager(this.game!).canBuyUpgrade(upgradeId)) {
        this.game!.dispatch({ type: "buyUpgrade", upgradeId });
      }
    });

    this.buttonSprite.addListener("mouseover", () => {});
    this.buttonSprite.addListener("mouseout", () => {});
  }

  onRender() {
    const canBuy = getUpgradeManager(this.game!).canAffordUpgrade(
      this.upgradeId
    );

    this.nameText.style.fill = canBuy ? "#000" : "#777";
    this.descriptionText.style.fill = canBuy ? "#000" : "#777";
    this.costText.style.fill = canBuy ? "#000" : "#f00";
  }
}
