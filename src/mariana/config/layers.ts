import Game from "../../core/Game";
import { LayerInfo } from "../../core/graphics/LayerInfo";

// Layers for rendering stuff in front of other stuff
export enum Layer {
  // Stuff that renders behind the normal stuff
  WORLD_BACK = "world_back",
  // The main layer where most stuff is
  WORLD = "world",
  // Stuff that renders in front of other stuff
  WORLD_FRONT = "world_front",
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

  game.renderer.defaultLayer = Layer.WORLD;
}
