import { BLEND_MODES, Graphics, Sprite } from "pixi.js";
import img_background from "../../../resources/images/background.png";
import img_sky from "../../../resources/images/sky.png";
import img_waterOverlay from "../../../resources/images/water-overlay.png";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { Layer } from "../config/layers";
import { WORLD_BOTTOM, WORLD_SIZE_METERS } from "../constants";

export class Water extends BaseEntity implements Entity {
  persistenceLevel = 1;

  constructor() {
    super();

    const sky = Sprite.from(img_sky);
    sky.height = 50;
    sky.width = WORLD_SIZE_METERS[0] * 2;
    sky.anchor.set(0.5, 1);

    const waterBack = Sprite.from(img_background);
    waterBack.height = WORLD_BOTTOM + 20;
    waterBack.width = WORLD_SIZE_METERS[0] * 2;
    waterBack.anchor.set(0.5, 0);

    const waterOverlay = Sprite.from(img_waterOverlay);
    waterOverlay.blendMode = BLEND_MODES.MULTIPLY;
    waterOverlay.anchor.set(0.5, 0);
    waterOverlay.width = WORLD_SIZE_METERS[0] * 2;
    waterOverlay.height = WORLD_BOTTOM + 20;

    (sky as GameSprite).layerName = Layer.BACKGROUND;
    (waterBack as GameSprite).layerName = Layer.BACKGROUND;
    (waterOverlay as GameSprite).layerName = Layer.WATER_OVERLAY;

    this.sprites = [sky, waterBack, waterOverlay];
  }
}
