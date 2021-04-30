import { BLEND_MODES, Sprite } from "pixi.js";
import img_pointLight from "../../../resources/images/point-light.png";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { V2d } from "../../core/Vector";
import { Light } from "./Light";

interface Options {
  size?: number;
  intensity?: number;
  color?: number;
}

// TODO: write me
export class Flashlight extends BaseEntity implements Entity {
  lightSprite: Sprite;

  constructor(
    position: V2d,
    { size = 1, intensity = 1, color = 0xffffff }: Options = {}
  ) {
    super();

    this.lightSprite = Sprite.from(img_pointLight);
    this.lightSprite.anchor.set(0.5);
    this.lightSprite.blendMode = BLEND_MODES.ADD;

    this.setPosition(position);
    this.size = size;
    this.intensity = intensity;
    this.color = color;

    this.addChild(new Light(this.lightSprite));
  }

  setPosition([x, y]: [number, number]) {
    this.lightSprite.position.set(x, y);
  }

  set size(value: number) {
    this.lightSprite.width = this.lightSprite.height = value;
  }

  get size(): number {
    return this.lightSprite.width;
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
}
