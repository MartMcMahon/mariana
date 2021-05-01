import { BLEND_MODES, Sprite } from "pixi.js";
import img_flashlightOverlay from "../../../resources/images/lights/flashlight-overlay.png";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { V, V2d } from "../../core/Vector";
import { Light } from "./Light";

interface Options {
  position?: V2d;
  length?: number;
  width?: number;
  intensity?: number;
  color?: number;
}

/** The light from a flashlight */
export class DirectionalLight extends BaseEntity implements Entity {
  lightSprite: Sprite;

  constructor({
    position = V(0, 0),
    length = 1,
    width = 1,
    intensity = 1,
    color = 0xffffff,
  }: Options = {}) {
    super();

    this.lightSprite = Sprite.from(img_flashlightOverlay);
    this.lightSprite.anchor.set(0, 0.5);
    this.lightSprite.blendMode = BLEND_MODES.ADD;

    this.setPosition(position);
    this.lightSprite.width = length;
    this.lightSprite.height = width;
    this.intensity = intensity;
    this.color = color;

    this.addChild(new Light(this.lightSprite));
  }

  setPosition([x, y]: [number, number]) {
    this.lightSprite.position.set(x, y);
  }

  set rotation(angle: number) {
    this.lightSprite.rotation = angle;
  }

  get rotation(): number {
    return this.lightSprite.rotation;
  }

  set intensity(value: number) {
    this.lightSprite.alpha = value;
  }

  get intensity(): number {
    return this.lightSprite.alpha;
  }

  set color(value: number) {
    this.lightSprite.tint = value;
  }

  get color(): number {
    return this.lightSprite.tint;
  }

  set length(value: number) {
    this.lightSprite.width = value;
  }

  get length(): number {
    return this.lightSprite.width;
  }

  set width(value: number) {
    this.lightSprite.height = value;
  }

  get width(): number {
    return this.lightSprite.height;
  }
}
