import { vec2 } from "p2";
import { Text } from "pixi.js";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { Layer } from "../config/layers";
import { Diver, getDiver } from "../diver/Diver";

export class OxygenGauge extends BaseEntity implements Entity {
  sprite: Text & GameSprite;

  constructor() {
    super();

    this.sprite = new Text("", { fontSize: 24, fill: "white" });
    this.sprite.layerName = Layer.HUD;
    // this.sprite.anchor.set(1);
    this.sprite.x = 5;
    this.sprite.y = 50;
  }

  onRender() {
    const diver = getDiver(this.game)!;
    const oxygen = Math.round(diver.oxygenManager.getOxygenPercent() * 100);
    this.sprite.text = `${oxygen}`;
  }
}
