import snd_musicalNope from "../../../resources/audio/musical_nope.flac";
import img_stoneTiles2 from "../../../resources/images/tiles/stone_tiles2.png";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { KeyCode } from "../../core/io/Keys";
import { SoundInstance } from "../../core/sound/SoundInstance";
import { OceanAmbience } from "../audio/OceanAmbience";
import { Boat } from "../Boat";
import { Diver, getDiver } from "../diver/Diver";
import { isFish } from "../enemies/BaseFish";
import { Water } from "../environment/Background";
import { Daylight } from "../environment/Daylight";
import { DiveWatch } from "../hud/DiveWatch";
import { FishCounter } from "../hud/FishCounter";
import LightingManager from "../lighting/LightingManager";
import PauseMenu from "../menu/PauseMenu";
import { generateRegions } from "../region/genRegions";
import { Tileset } from "../region/Tileset";
import { WorldBounds } from "../region/WorldBounds";
import { UpgradeManager } from "../upgrade/UpgradeManager";
import { UpgradeShop } from "../upgrade/UpgradeShop";
import { VictoryScreen } from "../VictoryScreen";
import CameraController from "./CameraController";
import { DiverController } from "./DiverController";

/**
 * The top level control flow for the game, basically manages transitioning between menus and stuff
 */
export class GameController extends BaseEntity implements Entity {
  persistenceLevel = 2;
  id = "game_controller";

  handlers = {
    // Called at the beginning of the game
    newGame: () => {
      this.game!.addEntity(new PauseMenu());
      this.game!.addEntity(new LightingManager());
      this.game!.addEntity(new Daylight());
      this.game!.addEntity(new Water());
      this.game!.addEntity(new Boat());
      this.game!.addEntity(new OceanAmbience());
      this.game!.addEntity(new UpgradeManager());
      this.game?.addEntity(new CameraController(this.game.camera));

      this.game!.addEntities(generateRegions());
      this.game?.addEntity(new WorldBounds(new Tileset(img_stoneTiles2, {})));
      const diver = this.game!.addEntity(new Diver());

      // this.game!.addEntity(new DamagedOverlay(() => diver));
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
      if (!this.game?.entities.getById("upgradeShop")) {
        this.game?.addEntity(new UpgradeShop());
      }
    },

    diverDied: async () => {
      this.game?.addEntity(new SoundInstance(snd_musicalNope));
      await this.wait(3.0);
      this.game?.dispatch({ type: "diveStart" });
    },

    victory: async () => {
      const diver = getDiver(this.game);

      // hacky way to make sure we don't die...
      diver?.oxygenManager.giveOxygen(10000);
      for (const fish of this.game!.entities.getByFilter(isFish)) {
        fish.destroy();
      }

      this.game!.addEntity(new VictoryScreen());
    },
  };

  onKeyDown(key: KeyCode) {
    switch (key) {
      case "KeyV":
        if (process.env.NODE_ENV === "development") {
          this.game?.dispatch({ type: "victory" });
        }
        break;
    }
  }
}
