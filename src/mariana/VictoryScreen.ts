import { Graphics, Sprite, Text, TextStyle } from "pixi.js";
import snd_victory from "../../resources/audio/misc/victory.flac";
import BaseEntity from "../core/entity/BaseEntity";
import Entity, { GameSprite } from "../core/entity/Entity";
import { SoundInstance } from "../core/sound/SoundInstance";
import { V2d } from "../core/Vector";
import { Layer } from "./config/layers";
import { FONT_HEADING } from "./fonts";

const LINES = [
  "Phew, I did it!",
  "All this searching has finally paid off.",
  "I finally found...",
  "MY PHONE",
];

const fontStyle: Partial<TextStyle> = {
  fontFamily: FONT_HEADING,
  fontSize: 48,
  wordWrap: true,
  wordWrapWidth: 100,
  align: "center",
};

export class VictoryScreen extends BaseEntity implements Entity {
  persistenceLevel = 1;
  id = "victoryScreen";
  sprite: Sprite & GameSprite;
  text: Text;
  background: Graphics;

  constructor() {
    super();

    this.text = new Text("", fontStyle);
    this.text.alpha = 0;
    this.text.anchor.set(0.5);

    this.background = new Graphics();
    this.background.beginFill(0xffffff);
    this.background.drawRect(0, 0, 10000, 10000);
    this.background.endFill();

    this.sprite = new Sprite();
    this.sprite.layerName = Layer.MENU;
    this.sprite.addChild(this.background);
    this.sprite.addChild(this.text);
    this.sprite.alpha = 0;
  }

  onResize([w, h]: V2d) {
    this.text.position.set(w / 2, h / 2);
    this.text.style.wordWrapWidth = w * 0.8;
  }

  async onAdd() {
    await this.wait(0.5, (dt, t) => (this.sprite.alpha = 0.5 * t));
    this.game!.addEntity(new SoundInstance(snd_victory));
    await this.wait(0.5, (dt, t) => (this.sprite.alpha = 0.5 + 0.5 * t));

    for (const line of LINES) {
      this.text.text = line;
      this.text.alpha = 0;
      await this.wait(0.75, (dt, t) => (this.text.alpha = t));
      await this.wait(1.5);
      await this.wait(0.6, (dt, t) => (this.text.alpha = 1 - t));
      await this.wait(0.2);
      this.text.alpha = 0;
    }

    this.game!.dispatch({ type: "diveStart" });

    await this.wait(3, (dt, t) => (this.sprite.alpha = 1 - t));
    this.destroy();
  }
}
