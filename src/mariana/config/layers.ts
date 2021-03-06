import Game from "../../core/Game";
import { GameRenderer2d } from "../../core/graphics/GameRenderer2d";
import { LayerInfo } from "../../core/graphics/LayerInfo";

// Layers for rendering stuff in front of other stuff
export enum Layer {
  // The real background layer
  BACKGROUND = "background",
  // Stuff that renders behind the normal stuff
  WORLD_BACK = "world_back",
  // The main layer where most stuff is
  WORLD = "world",
  // Stuff that renders in front of other stuff, but still in the water
  WORLD_FRONT = "world_front",
  // The water
  WATER_OVERLAY = "water_overlay",
  // Stuff not in the world, so it doesn't move when the camera moves
  HUD = "hud",
  // Stuff above even the HUD
  MENU = "menu",
}

// Special layers that don't move with the camera
const PARALAX_FREE_LAYERS = [Layer.HUD, Layer.MENU];

// Set up the game to use our layers
export function initLayers(game: Game) {
  for (const layerName of Object.values(Layer)) {
    game.renderer.createLayer(layerName, new LayerInfo({}));
  }

  for (const layerName of PARALAX_FREE_LAYERS) {
    game.renderer.layerInfos.get(layerName)!.paralax = 0;
  }

  // game.renderer.layerInfos.get(Layer.BACKGROUND)!.paralax = 0.9;

  game.renderer.defaultLayer = Layer.WORLD;
}
