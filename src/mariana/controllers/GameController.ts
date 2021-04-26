import snd_musicalNope from "../../../resources/audio/musical_nope.flac";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { KeyCode } from "../../core/io/Keys";
import { SoundInstance } from "../../core/sound/SoundInstance";
import { OceanAmbience } from "../audio/OceanAmbience";
import { Background } from "../Background";
import { Boat } from "../Boat";
import { Diver, getDiver } from "../diver/Diver";
import { DiverController } from "../DiverController";
import { WaterOverlay } from "../effects/WaterOverlay";
import { DamagedOverlay } from "../hud/DamagedOverlay";
import { DiveWatch } from "../hud/DiveWatch";
import { FishCounter } from "../hud/FishCounter";
import { generateRegions } from "../region/genRegions";
import { UpgradeManager } from "../upgrade/UpgradeManager";
import { UpgradeShop } from "../upgrade/UpgradeShop";
import CameraController from "./CameraController";

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
      this.game?.addEntity(new CameraController(this.game.camera));

      this.game!.addEntities(generateRegions());
      const diver = this.game!.addEntity(new Diver());

      this.game!.addEntity(new DamagedOverlay(() => diver));
      this.game?.addEntity(new DiverController(diver));
      this.game!.addEntity(new DiveWatch(diver));
      this.game!.addEntity(new FishCounter(diver));

      this.game!.dispatch({ type: "diveStart" });
    },

    diveStart: () => {
      console.log("dive start");
      const diver = getDiver(this.game)!;
      diver.onBoat = true;
    },

    openShop: async () => {
      const diver = getDiver(this.game)!;
      diver.onBoat = true;
      this.game?.addEntity(new UpgradeShop());
    },

    diverDied: async () => {
      this.game?.addEntity(new SoundInstance(snd_musicalNope));
      await this.wait(3.0);
      this.game?.dispatch({ type: "diveStart" });
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
