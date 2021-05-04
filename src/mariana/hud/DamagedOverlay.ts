import * as Pixi from "pixi.js";
import { Container, Graphics } from "pixi.js";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../core/entity/Entity";
import Game from "../../core/Game";
import { smoothStep } from "../../core/util/MathUtil";
import { Layer } from "../config/layers";
import {
  getCurrentGraphicsQuality,
  getResolutionForGraphicsQuality,
  GraphicsQuality,
} from "../controllers/GraphicsQualityController";
import { Diver } from "../diver/Diver";
import frag_damageFilter from "./damage-filter.frag";

export class DamagedOverlay extends BaseEntity implements Entity {
  persistenceLevel = 0;
  sprite: Container & GameSprite;
  colorFilter: Pixi.Filter;

  constructor(private getPlayer: () => Diver | undefined) {
    super();

    this.sprite = new Container();
    this.sprite.layerName = Layer.HUD;

    this.colorFilter = new Pixi.Filter(undefined, frag_damageFilter, {
      healthPercent: 1.0,
    });
  }

  onAdd(game: Game) {
    this.colorFilter.resolution = getResolutionForGraphicsQuality(
      getCurrentGraphicsQuality(game)
    );
    game.renderer.addStageFilter(this.colorFilter);
  }

  onDestroy(game: Game) {
    game.renderer.removeStageFilter(this.colorFilter);
  }

  handlers = {
    diverHurt: ({ amount }: { amount: number }) => {
      this.flash(0x550011, 0, 0.4, 0.2);
    },

    graphicsQualityChanged: ({ quality }: { quality: GraphicsQuality }) => {
      this.colorFilter.resolution = getResolutionForGraphicsQuality(quality);
    },
  };

  onRender() {
    const diver = this.getPlayer();
    if (diver && !diver.isDestroyed) {
      this.updateBaseline(1.0 - diver.air.suffocationPercent);
    } else {
      this.updateBaseline(0.0);
    }
  }

  updateBaseline(healthPercent: number) {
    this.colorFilter.uniforms.healthPercent = healthPercent;
  }

  makeOverlay(color: number = 0xff0000): Graphics {
    const [width, height] = this.game!.renderer.getSize();
    return new Graphics()
      .clear()
      .beginFill(color)
      .drawRect(0, 0, width, height)
      .endFill();
  }

  async flash(
    color: number,
    fadeInTime: number = 0,
    fadeOutTime: number = 0.4,
    alpha: number = 0.2
  ) {
    const graphics = this.makeOverlay(color);
    this.sprite.addChild(graphics);
    await this.wait(fadeInTime, (dt, t) => {
      graphics.alpha = smoothStep(t * alpha);
    });
    await this.wait(
      fadeOutTime,
      (dt, t) => {
        graphics.alpha = smoothStep((1 - t) * alpha);
      },
      "flash"
    );
    this.sprite.removeChild(graphics);
  }
}
