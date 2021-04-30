import { Filter, Sprite } from "pixi.js";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { hexToVec3 } from "../../core/util/ColorUtils";
import { Layer } from "../config/layers";
import { WORLD_BOTTOM, WORLD_SIZE_METERS } from "../constants";
import { Waves } from "../effects/Waves";
import frag_background from "./background.frag";

export class Water extends BaseEntity implements Entity {
  persistenceLevel = 1;
  filter: Filter;

  constructor() {
    super();

    const sprite = (this.sprite = new Sprite());
    sprite.anchor.set(0.5, 0.5);
    sprite.width = WORLD_SIZE_METERS[0];
    sprite.height = WORLD_SIZE_METERS[1] * 2;

    this.filter = new Filter(undefined, frag_background);
    sprite.filters = [this.filter];

    this.sprite.layerName = Layer.BACKGROUND;

    this.addChild(new Waves());
  }

  getUniforms() {
    const resolution = this.filter.resolution;
    const cameraMatrix = this.game?.camera
      .getMatrix()
      .scale(resolution, resolution)
      .invert();

    return {
      cameraMatrix,
      resolution,
      skyHeight: 30,
      waterDepth: WORLD_BOTTOM - 10,
    };
  }

  onRender() {
    for (const [uniform, value] of Object.entries(this.getUniforms())) {
      this.filter.uniforms[uniform] = value;
    }
  }
}
