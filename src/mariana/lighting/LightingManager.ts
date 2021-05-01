import {
  BLEND_MODES,
  DisplayObject,
  Graphics,
  RenderTexture,
  Sprite,
} from "pixi.js";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../core/entity/Entity";
import Game from "../../core/Game";
import { V } from "../../core/Vector";
import { Layer } from "../config/layers";
import { Persistence } from "../config/Persistence";

export default class LightingManager extends BaseEntity implements Entity {
  id = "lighting_manager";
  persistenceLevel = Persistence.Game;

  sprite!: Sprite & GameSprite;
  private texture!: RenderTexture;
  private lightContainer = new Sprite();
  private darkness: Graphics = new Graphics();

  ambientColor = 0x000000;

  private get renderer() {
    return this.game!.renderer.pixiRenderer;
  }

  onAdd(game: Game) {
    const [width, height] = game.renderer.getSize();
    this.texture = RenderTexture.create({
      width: width,
      height: height,
      resolution: game.renderer.pixiRenderer.resolution,
    });

    this.drawDarkness();

    this.sprite = new Sprite(this.texture);
    this.sprite.layerName = Layer.LIGHTING;
    this.sprite.blendMode = BLEND_MODES.MULTIPLY;
    this.sprite.anchor.set(0, 0);

    this.lightContainer.blendMode = BLEND_MODES.ADD;
  }

  onResize([width, height]: [number, number]) {
    this.texture.resize(width, height);
    this.drawDarkness();
  }

  drawDarkness() {
    const { width, height } = this.texture;
    this.darkness
      .beginFill(this.ambientColor)
      .drawRect(0, 0, width, height)
      .endFill();
  }

  addLight(light: DisplayObject) {
    this.lightContainer.addChild(light);
  }

  removeLight(light: DisplayObject) {
    this.lightContainer.removeChild(light);
  }

  // Use late render so that it happens after everyone else has rendered and all their light positions and stuff are updated
  onLateRender() {
    const matrix = this.game!.camera.getMatrix();
    // const inverseMatrix = matrix.clone().invert();
    this.lightContainer.transform.setFromMatrix(matrix);

    const renderTexture = this.texture;
    // Clear everything
    this.renderer.render(this.darkness, { renderTexture });

    // Then render it all
    this.renderer.render(this.lightContainer, { renderTexture, clear: false });
  }
}

export function getLightingManager(game?: Game): LightingManager | undefined {
  return game?.entities.getById("lighting_manager") as LightingManager;
}
