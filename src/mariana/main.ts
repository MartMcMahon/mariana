import { ALL_IMAGES, ALL_SOUNDS } from "../../resources/assets";
import AutoPauser from "../core/AutoPauser";
import Game from "../core/Game";
import CustomWorld from "../core/physics/CustomWorld";
import SpatialHashingBroadphase from "../core/physics/SpatialHashingBroadphase";
import PositionalSoundListener from "../core/sound/PositionalSoundListener";
import FPSMeter from "../core/util/FPSMeter";
import { initLayers, Layer } from "./config/layers";
import { initContactMaterials } from "./config/PhysicsMaterials";
import { GameController } from "./controllers/GameController";
import { GraphicsQualityController } from "./controllers/GraphicsQualityController";
import VolumeController from "./controllers/VolumeController";
import { isFish } from "./fish/BaseFish";
import Preloader from "../core/resources/Preloader";
import { getFontsToPreload } from "./fonts";

// So we can attach stuff to the window
declare global {
  interface Window {
    DEBUG: { game?: Game };
  }
}

// The entry point to our game
export async function main() {
  await new Promise((resolve) => window.addEventListener("load", resolve));

  // The top-level object for all of our state
  const game = new Game({
    // how many times tick is called per render.
    // higher improves physics fidelity at the possible cost of performance
    tickIterations: 4,

    // Parameters for the physics engine
    world: new CustomWorld({
      // no gravity, we can add it ourselves if we want it
      gravity: [0, 0],
      // Use our homegrown broadphase implementation. It's generally _much_ faster
      broadphase: new SpatialHashingBroadphase(3, 30, 100),
    }),
  });

  game.world.frictionGravity = 10; // dunno what this does, but at one point I determined it was important

  // Make the game available in the console for debugging
  window.DEBUG = { game };

  // Configure layers for rendering
  initLayers(game);
  // Configure physics materials
  initContactMaterials(game);

  // Start the event loop
  game.start();

  // Load all our assets before we try to use them
  const preloader = game.addEntity(
    new Preloader(
      () => ALL_IMAGES,
      () => ALL_SOUNDS,
      () => getFontsToPreload()
    )
  );
  await preloader.waitTillLoaded();
  preloader.destroy();

  // Add some entity filters for fast lookup of certain entities later
  // Think of these like indexes in a DB
  game.entities.addFilter(isFish);

  // Add various singletons that will live forever
  game.addEntity(new AutoPauser()); // pauses when window loses focus
  game.addEntity(new GraphicsQualityController()); // allows toggling of graphics quality
  game.addEntity(new VolumeController()); // allows muting
  game.addEntity(new PositionalSoundListener()); // like the camera, but for our ears
  game.addEntity(new GameController()); // Top level control flow for our actual game logic

  // Add dev tools
  if (process.env.NODE_ENV === "development") {
    game.addEntity(new FPSMeter(Layer.DEBUG_INFO));
  }

  game.dispatch({ type: "newGame" });

  // // Make the game fullScreen on click
  // const element = game.renderer.pixiRenderer.view;
  // const makeFullScreen = () => {
  //   element.requestFullscreen();
  //   element.removeEventListener("click", makeFullScreen);
  // };
  // element.addEventListener("click", makeFullScreen);
}
