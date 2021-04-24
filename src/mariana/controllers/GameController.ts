import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { Diver } from "../Diver";
import { Obstacle } from "../Obstacle";
import CameraController from "./CameraController";

enum GamePhase {
  // The menu before we've started
  StartMenu,
  // We're in the menu buying stuff
  Buying,
  // We're actively diving
  Diving,
  // We've died and it's playing the animation as we surface
  Dead,
}

/**
 * The top level control flow for the game, basically manages transitioning between menus and stuff
 */
export class GameController extends BaseEntity implements Entity {
  persistenceLevel = 2;
  id = "game_controller";

  gamePhase: GamePhase = GamePhase.StartMenu;

  handlers = {
    // Called at the beginning of the game
    gameStart: () => {
      console.log("game started");

      this.game!.dispatch({ type: "diveStart" });
    },

    diveStart: () => {
      console.log("dive start");
      this.gamePhase = GamePhase.Diving;
      const diver = this.game!.addEntity(new Diver());
      this.game?.addEntity(new CameraController(this.game.camera, diver));
      this.game!.addEntity(new Obstacle(8, 0, 10, 10));
    },

    diveEnd: async () => {
      this.game!.clearScene();
      this.gamePhase = GamePhase.Dead;

      console.log("dive over");

      await this.wait(1.0);

      // Remove all entities with a persistence level of 0 (the default)
      this.game?.clearScene(0);

      this.game!.dispatch({ type: "diveStart" });
    },
  };

  onTick() {
    if (this.gamePhase === GamePhase.Diving) {
      const diver = this.game!.entities.getById("diver") as Diver;
      const depth = diver.body.position[1];
      if (depth > 100) {
        this.game?.dispatch({ type: "diveEnd" });
      }
    }
  }
}
