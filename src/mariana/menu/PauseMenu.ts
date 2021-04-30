import { Graphics, Sprite, Text } from "pixi.js";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../core/entity/Entity";
import Game from "../../core/Game";
import { ControllerButton } from "../../core/io/Gamepad";
import { KeyCode } from "../../core/io/Keys";
import { Layer } from "../config/layers";
import { Persistence } from "../config/Persistence";
import { FONT_HEADING } from "../fonts";
import ClickableText from "./ClickableText";
import GraphicsButton from "./GraphicsButton";
import MuteButton from "./MuteButton";

// Shows the menu when paused, invisible otherwise
export default class PauseMenu extends BaseEntity implements Entity {
  persistenceLevel = Persistence.Game;
  pausable = false;
  sprite: Sprite & GameSprite;
  pausedText: Text;
  mainMenuButton: ClickableText;
  resumeText: Text;
  muteButton: ClickableText;
  graphicsButton: GraphicsButton;

  constructor() {
    super();

    this.sprite = new Sprite();
    this.sprite.layerName = Layer.MENU;
    this.sprite.visible = false;

    const background = new Graphics();
    background.beginFill(0x6699cc, 0.3);
    background.drawRect(0, 0, 10000, 10000);
    background.endFill();
    this.sprite.addChild(background);

    this.pausedText = new Text("PAUSED", {
      fontSize: 96,
      fontFamily: FONT_HEADING,
      fill: "#0000ff",
      align: "center",
    });
    this.pausedText.anchor.set(0.5, 1);
    this.sprite.addChild(this.pausedText);

    this.resumeText = new Text("", {
      fontSize: 48,

      fontFamily: FONT_HEADING,
      fill: "white",
      align: "center",
    });
    this.resumeText.anchor.set(0.5, 0);
    this.sprite.addChild(this.resumeText);

    this.mainMenuButton = this.addChild(
      new ClickableText("Main Menu", () => {
        this.game?.unpause();
        this.game?.dispatch({ type: "gameOver" });
        this.destroy();
      })
    );

    this.muteButton = this.addChild(new MuteButton());

    this.graphicsButton = this.addChild(new GraphicsButton());
  }

  onAdd(game: Game) {
    this.setVisibility(game.paused);
  }

  onInputDeviceChange(usingGamepad: boolean) {
    const buttonName = usingGamepad ? "START" : "P";
    this.resumeText.text = `Press ${buttonName} to resume`;
  }

  onResize([width, height]: [number, number]) {
    this.pausedText.position.set(width / 2, height / 2);
    this.resumeText.position.set(width / 2, height / 2);

    this.mainMenuButton.sprite.position.set(10, 10);
    this.muteButton.sprite.position.set(10, 90);
    this.graphicsButton.sprite.position.set(10, 130);
  }

  setVisibility(visible: boolean) {
    this.sprite.visible = visible;

    // TODO: Can we make this a little more automated?
    this.mainMenuButton.sprite.visible = visible;
    this.muteButton.sprite.visible = visible;
    this.graphicsButton.sprite.visible = visible;

    this.mainMenuButton.sprite.interactive = visible;
    this.muteButton.sprite.interactive = visible;
    this.graphicsButton.sprite.interactive = visible;
  }

  onPause() {
    this.setVisibility(true);
  }

  onUnpause() {
    this.setVisibility(false);
  }

  onKeyDown(key: KeyCode) {
    switch (key) {
      case "KeyP":
      case "Escape":
        this.game?.togglePause();
        break;
    }
  }

  onButtonDown(button: ControllerButton) {
    if (button === ControllerButton.START) {
      this.game?.togglePause();
    }
  }
}
