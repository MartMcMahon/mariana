import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { KeyCode } from "../../core/io/Keys";
import { rUniform } from "../../core/util/Random";
import { V } from "../../core/Vector";
import { Background } from "../Background";
import { Boat } from "../Boat";
import { OCEAN_DEPTH } from "../constants";
import { Diver } from "../Diver";
import { Jellyfish } from "../enemies/Jellyfish";
import { DepthGauge } from "../hud/DepthGauge";
import { Obstacle } from "../Obstacle";
import { UpgradeShop } from "../upgrade/UpgradeShop";
import { WaterOverlay } from "../effects/WaterOverlay";
import CameraController from "./CameraController";

enum GamePhase {
  // The menu before we've started
  StartMenu,
  // We're in the menu buying stuff
  Buying,
  // We're actively diving
  Diving,
  // We're celebrating
  Victory,
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

      this.game!.addEntity(new Background());
      this.game!.addEntity(new Boat());
      this.game!.addEntity(new WaterOverlay());
    },

    diveStart: () => {
      console.log("dive start");
      this.gamePhase = GamePhase.Diving;
      const diver = this.game!.addEntity(new Diver());
      this.game?.addEntity(new CameraController(this.game.camera, diver));

      this.game!.addEntity(new Obstacle(8, 10, 3, 3));
      this.game!.addEntity(new DepthGauge());

      for (let i = 0; i < 10; i++) {
        this.game?.addEntity(
          new Jellyfish(V(rUniform(-30, 30), rUniform(10, 30)))
        );
      }
    },

    diveEnd: async () => {
      this.gamePhase = GamePhase.Dead;

      console.log("dive over");

      // TODO: drag body up on rope
      await this.wait(0.1);
      this.game!.camera.vy = -10;
      this.game!.camera.vx = 0;
      await this.waitUntil(() => this.game!.camera.y <= 0);
      console.log("at surface");
      this.game!.camera.vy = 0;

      // Remove all entities with a persistence level of 0 (the default)
      this.game!.clearScene(0);
      this.game!.addEntity(new UpgradeShop());
    },

    victory: async () => {
      console.log("You win!");
      this.gamePhase = GamePhase.Victory;
      // TODO: More victory stuff
      await this.wait(2.0);

      // Remove all entities with a persistence level of 0 (the default)
      this.game?.clearScene(0);

      this.game!.dispatch({ type: "diveStart" });
    },
  };

  onTick() {
    if (this.gamePhase === GamePhase.Diving) {
      const diver = this.game!.entities.getById("diver") as Diver;
      const depth = diver.body.position[1];
      if (depth > OCEAN_DEPTH) {
        this.game?.dispatch({ type: "victory" });
      }
    }
  }

  onKeyDown(key: KeyCode) {
    switch (key) {
      case "KeyR":
        this.game?.dispatch({ type: "diveEnd" });
    }
  }
}
