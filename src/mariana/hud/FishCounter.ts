import { Sprite, Text, TextStyle } from "pixi.js";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { V2d } from "../../core/Vector";
import { Layer } from "../config/layers";
import { Diver } from "../diver/Diver";
import { DIVE_WATCH_HEIGHT, DIVE_WATCH_WIDTH } from "./DiveWatch";

const TEXT_STYLE: Partial<TextStyle> = {
  fontFamily: "Montserrat Alternates Black",
  fill: "white",

  dropShadow: true,
  dropShadowBlur: 8,
  dropShadowAlpha: 0.6,
  dropShadowColor: 0x001133,
  dropShadowDistance: 2.5,
};
export class FishCounter extends BaseEntity implements Entity {
  sprite: Sprite & GameSprite;
  fishNumber: Text;
  fishLabel: Text;

  constructor(public diver: Diver) {
    super();

    this.sprite = new Sprite();
    this.sprite.anchor.set(0, 1);
    this.sprite.layerName = Layer.HUD;

    this.fishLabel = new Text("FISH", {
      ...TEXT_STYLE,
      fontSize: 16,
    });
    this.fishNumber = new Text("0", {
      ...TEXT_STYLE,
      fontSize: 36,
    });
    this.fishLabel.anchor.set(0.5, 0.9);
    this.fishNumber.anchor.set(0.5, 0.1);
    this.fishLabel.y = 0;
    this.fishNumber.y = 0;

    this.sprite.addChild(this.fishLabel);
    this.sprite.addChild(this.fishNumber);
  }

  onResize([width, height]: V2d) {
    this.sprite!.x = width - DIVE_WATCH_WIDTH * 0.4;
    this.sprite!.y = height - DIVE_WATCH_HEIGHT - 30;
  }

  onRender() {
    const fish = this.diver.inventory.fishSouls;
    this.fishNumber.text = `${fish}`;
  }
}
