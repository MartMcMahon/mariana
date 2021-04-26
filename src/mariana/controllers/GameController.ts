import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { KeyCode } from "../../core/io/Keys";
import { OceanAmbience } from "../audio/OceanAmbience";
import { Background } from "../Background";
import { Boat } from "../Boat";
import { Diver, getDiver } from "../diver/Diver";
import { DiverController } from "../DiverController";
import { WaterOverlay } from "../effects/WaterOverlay";
import { DamagedOverlay } from "../hud/DamagedOverlay";
import { DiveWatch } from "../hud/DiveWatch";
import { FishCounter } from "../hud/FishCounter";
import { genRegions } from "../region/genRegions";
import { UpgradeManager } from "../upgrade/UpgradeManager";
import { UpgradeShop } from "../upgrade/UpgradeShop";
import CameraController from "./CameraController";
import { ProgressInfoController } from "./progressInfoController";

/**
 * The top level control flow for the game, basically manages transitioning between menus and stuff
 */
export class GameController extends BaseEntity implements Entity {
  persistenceLevel = 2;
  id = "game_controller";

  handlers = {
    // Called at the beginning of the game
    gameStart: () => {
      this.game!.addEntity(new Background());
      this.game!.addEntity(new Boat());
      this.game!.addEntity(new WaterOverlay());
      this.game!.addEntity(new OceanAmbience());
      this.game!.addEntity(new UpgradeManager());
      this.game!.addEntity(new ProgressInfoController());
      this.game?.addEntity(new CameraController(this.game.camera));

      this.game!.addEntities(genRegions());
      this.game!.addEntity(new Diver());

      this.game!.dispatch({ type: "diveStart" });
    },

    diveStart: () => {
      console.log("dive start");
      const diver = getDiver(this.game)!;

      this.game!.addEntity(new DamagedOverlay(() => diver));
      this.game?.addEntity(new DiverController(diver));
      this.game!.addEntity(new DiveWatch(diver));
      this.game!.addEntity(new FishCounter(diver));
    },

    openShop: async () => {
      this.game?.clearScene(0);
      const diver = getDiver(this.game)!;
      diver.onBoat = true;
      this.game?.addEntity(new UpgradeShop());
    },

    diveEnd: async () => {},

    diverDied: async () => {
      await this.wait(2.0);
      this.game!.camera.vy = -10;
      this.game!.camera.vx = 0;
      await this.waitUntil(() => this.game!.camera.y <= 0);
      console.log("at surface");
      this.game!.camera.vy = 0;
    },

    victory: async () => {
      // TODO: More victory stuff

      console.log("You win!");

      await this.wait(5.0);

      // Start over completely
      this.game?.clearScene(1);
      this.game!.dispatch({ type: "gameStart" });
    },
  };

  onKeyDown(key: KeyCode) {
    switch (key) {
    }
  }
}
