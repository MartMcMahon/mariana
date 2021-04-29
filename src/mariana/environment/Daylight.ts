import { BLEND_MODES, Graphics, Sprite } from "pixi.js";
import img_daylight from "../../../resources/images/daylight.png";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { lerp } from "../../core/util/MathUtil";
import { WORLD_BOTTOM, WORLD_SIZE_METERS } from "../constants";
import { Light } from "../lighting/Light";

export const SECONDS_PER_DAY = 60;
const MAX_ALPHA = 1.0;
const MIN_ALPHA = 0.9;

export class Daylight extends BaseEntity implements Entity {
  lightSprite: Sprite;

  constructor() {
    super();

    const sky = new Graphics();
    sky.beginFill(0xffffff);
    sky.drawRect(-1000, -1000, 2000, 1000);
    sky.endFill();
    sky.blendMode = BLEND_MODES.ADD;

    this.lightSprite = Sprite.from(img_daylight);
    this.lightSprite.anchor.set(0.5, 0);
    this.lightSprite.width = WORLD_SIZE_METERS[0] * 2;
    this.lightSprite.height = WORLD_BOTTOM + 20;
    this.lightSprite.blendMode = BLEND_MODES.ADD;

    this.lightSprite.addChild(sky);

    this.addChild(new Light(this.lightSprite));
  }

  onRender() {
    const day = this.game!.elapsedTime / SECONDS_PER_DAY;
    const sunPercent = (Math.cos(Math.PI * 2 * day) + 1) / 2;

    this.lightSprite.alpha = lerp(MIN_ALPHA, MAX_ALPHA, sunPercent);
  }
}
