import { Sprite } from "pixi.js";
import img_diveWatchBack from "../../../resources/images/dive-watch-back.png";
import img_diveWatchNeedle from "../../../resources/images/dive-watch-needle.png";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { clamp, degToRad, lerp, stepToward } from "../../core/util/MathUtil";
import { V2d } from "../../core/Vector";
import { Layer } from "../config/layers";
import { Diver } from "../diver/Diver";

const MAX_DEPTH = 100;

const MIN_AIR_ANGLE = degToRad(-135);
const MAX_AIR_ANGLE = degToRad(135);
const MIN_DEPTH_ANGLE = degToRad(-150);
const MAX_DEPTH_ANGLE = degToRad(150);

const NEEDLE_SPEED = 2;

const SCALE = 0.4;
const WIDTH = 512 * SCALE;
const HEIGHT = 512 * SCALE;

export class DiveWatch extends BaseEntity implements Entity {
  sprite: Sprite & GameSprite;
  airNeedleSprite: Sprite;
  depthNeedleSprite: Sprite;
  faceSprite: Sprite;

  constructor(private diver: Diver) {
    super();

    const sprite = (this.sprite = new Sprite());
    sprite.anchor.set(1);
    sprite.scale.set(SCALE);

    this.faceSprite = Sprite.from(img_diveWatchBack);
    this.airNeedleSprite = Sprite.from(img_diveWatchNeedle);
    this.depthNeedleSprite = Sprite.from(img_diveWatchNeedle);

    this.airNeedleSprite.anchor.set(0.5, 1);
    this.depthNeedleSprite.anchor.set(0.5, 1);

    this.airNeedleSprite.position.set(256, 166);
    this.depthNeedleSprite.position.set(256, 336);

    this.depthNeedleSprite.rotation = MIN_DEPTH_ANGLE;
    this.airNeedleSprite.rotation = MIN_AIR_ANGLE;

    sprite.addChild(this.faceSprite);
    sprite.addChild(this.depthNeedleSprite);
    sprite.addChild(this.airNeedleSprite);

    this.sprite.layerName = Layer.HUD;
  }

  onResize([width, height]: V2d) {
    this.sprite!.x = width - WIDTH;
    this.sprite!.y = height - HEIGHT;
  }

  onRender(dt: number) {
    const depthPercent = this.diver.getDepth() / MAX_DEPTH;
    const airPercent = this.diver.oxygenManager.getOxygenPercent();

    const airTargetAngle = lerp(MIN_AIR_ANGLE, MAX_AIR_ANGLE, airPercent);

    const depthTargetAngle = lerp(
      MIN_DEPTH_ANGLE,
      MAX_DEPTH_ANGLE,
      depthPercent
    );

    this.airNeedleSprite.rotation = lerp(
      this.airNeedleSprite.rotation,
      airTargetAngle,
      clamp(dt * NEEDLE_SPEED)
    );

    this.depthNeedleSprite.rotation = lerp(
      this.depthNeedleSprite.rotation,
      depthTargetAngle,
      clamp(dt * NEEDLE_SPEED)
    );
  }
}
