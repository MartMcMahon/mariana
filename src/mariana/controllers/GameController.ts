import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";

/**
 * The top level control flow for the game, basically manages transitioning between menus and stuff
 */
export class GameController extends BaseEntity implements Entity {
  handlers = {
    gameStart: () => {
      console.log("game started");
    },
  };
}
