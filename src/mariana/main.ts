import { SAPBroadphase, World } from "p2";
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
import { isFish } from "./enemies/BaseFish";
import Preloader from "./preloader/Preloader";

declare global {
  interface Window {
    DEBUG: { game?: Game };
  }
}

export async function main() {
  await new Promise((resolve) => window.addEventListener("load", resolve));

  const game = new Game({
    tickIterations: 4,
    world: new CustomWorld({
      gravity: [0, 0],
      broadphase: new SpatialHashingBroadphase(3, 30, 100),
    }),
  });
  game.world.frictionGravity = 10;
  initLayers(game);
  initContactMaterials(game);

  window.DEBUG = { game };
  game.start();

  const preloader = game.addEntity(new Preloader());
  await preloader.waitTillLoaded();
  preloader.destroy();

  // Add some filters for fast lookup of certain entities later
  // Think of these like indexes in a DB
  game.entities.addFilter(isFish);

  game.addEntity(new AutoPauser());
  game.addEntity(new PositionalSoundListener());
  game.addEntity(new GameController());
  game.addEntity(new GraphicsQualityController());
  game.addEntity(new VolumeController());

  if (process.env.NODE_ENV === "development") {
    game.addEntity(new FPSMeter(Layer.MENU));
  }

  game.dispatch({ type: "gameStart" });

  const element = game.renderer.pixiRenderer.view;

  const makeFullScreen = () => {
    element.requestFullscreen();
    element.removeEventListener("click", makeFullScreen);
  };
  // element.addEventListener("click", makeFullScreen);
}
