import { Filter, Graphics, Sprite } from "pixi.js";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../core/entity/Entity";
import Game from "../../core/Game";
import { hexToVec3 } from "../../core/util/ColorUtils";
import { V, V2d } from "../../core/Vector";
import { Layer } from "../config/layers";
import {
  WORLD_BOTTOM,
  WORLD_LEFT_EDGE,
  WORLD_RIGHT_EDGE,
  WORLD_SIZE_METERS,
} from "../constants";
import frag_waves from "./waves.frag";
import vert_waves from "./waves.vert";

export const MAX_WAVE_HEIGHT = 10;
export const WATER_COLOR = 0x0099ff;

export class Waves extends BaseEntity implements Entity {
  id = "waves";

  filter: Filter;
  t = 0;
  w: number = 20 * (1000 / 3600); // 20 km/h

  constructor() {
    super();

    this.filter = new Filter(vert_waves, frag_waves, {});

    const sprite = (this.sprite = new Sprite());

    sprite.anchor.set(0.5, 0);
    sprite.width = WORLD_SIZE_METERS[0];
    sprite.height = WORLD_BOTTOM + MAX_WAVE_HEIGHT;
    sprite.x = 0;
    sprite.y = -MAX_WAVE_HEIGHT / 2;

    sprite.filters = [this.filter];

    this.sprite.layerName = Layer.WATER_OVERLAY;

    // this.addChild(new DebugWaves((x) => this.getSurfaceHeight(x)));
  }

  onAdd() {
    console.log(this.getUniforms(), this.getSurfaceHeight(0));
  }

  onTick(dt: number) {
    this.t += dt;
  }

  getSurfaceHeight(x: number) {
    const { t, a, lambda, T } = this.getWaveStats();
    const wave1 = a * Math.sin(2 * Math.PI * (x / lambda - t / T));

    return wave1;
  }

  getSurfaceVelocity(x: number): V2d {
    const { t, a, lambda, T } = this.getWaveStats();
    const wave1 =
      -a * Math.cos((2 * Math.PI * x) / lambda - (2 * Math.PI * t) / T);

    return V(0, wave1);
  }

  getWaveStats() {
    return {
      t: this.t,
      a: (1.039702 - 0.08155357 * this.w + 0.002481548 * this.w ** 2) / 2,
      lambda: -738512.1 + 738525.2 * Math.exp(0.00001895026 * this.w),
      T: 17.91851 - 15.52928 * Math.exp(-0.006572834 * this.w),
    };
  }

  getUniforms() {
    const resolution = this.filter.resolution;
    const cameraMatrix = this.game?.camera
      .getMatrix()
      .scale(resolution, resolution)
      .invert();

    return {
      ...this.getWaveStats(),
      cameraMatrix,
      resolution,
      waterColor: hexToVec3(WATER_COLOR),
    };
  }

  onRender(dt: number) {
    for (const [uniform, value] of Object.entries(this.getUniforms())) {
      this.filter.uniforms[uniform] = value;
    }
  }
}

export function getWaves(game: Game): Waves {
  return game.entities.getById("waves") as Waves;
}

// Draws waves with graphics. This is probably slow, so maybe don't do it
export class DebugWaves extends BaseEntity implements Entity {
  sprite: Graphics & GameSprite;

  constructor(public getHeight: (x: number) => number) {
    super();
    this.sprite = new Graphics();
    this.sprite.layerName = Layer.WORLD_EXTRA_FRONT;
  }

  onRender() {
    this.sprite.clear();

    this.sprite.beginFill(0x0000ff);
    // this.sprite.lineStyle(0.2, 0xff0000, 0.5);
    this.sprite.moveTo(WORLD_LEFT_EDGE, MAX_WAVE_HEIGHT / 2);
    const stepSize = 0.25;
    for (let x = WORLD_LEFT_EDGE; x < WORLD_RIGHT_EDGE; x += stepSize) {
      this.sprite.lineTo(x, this.getHeight(x));
    }

    this.sprite.endFill();
  }
}
