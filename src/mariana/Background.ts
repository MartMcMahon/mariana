import { DisplayObject, Graphics, Sprite } from "pixi.js";
import img_background from "../../resources/images/background.png";
import BaseEntity from "../core/entity/BaseEntity";
import Entity, { GameSprite } from "../core/entity/Entity";
import { Layer } from "./config/layers";
import { OCEAN_DEPTH } from "./constants";

export class Background extends BaseEntity implements Entity {
  sprite: GameSprite & Sprite;
  constructor() {
    super();

    const sky = new Graphics();
    sky.beginFill(0xaaccff);
    sky.drawRect(-1000, -1000, 2000, 1000);
    sky.endFill();

    const waterSprite = Sprite.from(img_background);
    waterSprite.scale.set(OCEAN_DEPTH / waterSprite.texture.height);
    waterSprite.anchor.set(0.5, 0);

    this.sprite = new Sprite();
    this.sprite.addChild(sky);
    this.sprite.addChild(waterSprite);
    this.sprite.layerName = Layer.WORLD_BACK;
  }
}
