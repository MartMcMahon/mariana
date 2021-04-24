import { DisplayObject } from "pixi.js";
import Game from "../Game";
import EntityPhysics from "./EntityPhysics";
import GameEventHandler from "./GameEventHandler";
import IOEventHandler from "./IOEventHandler";

export interface GameSprite extends DisplayObject, WithOwner {
  layerName?: string;
}

/**
 * A thing that responds to game events.
 */
export default interface Entity
  extends GameEventHandler,
    EntityPhysics,
    IOEventHandler {
  /** The game this entity belongs to. This should only be set by the Game. */
  game: Game | undefined;

  id?: string;

  /** Children that get added/destroyed along with this entity */
  readonly children?: Entity[];

  /** Entity that has this entity as a child */
  parent?: Entity;

  /** Tags to find entities by */
  readonly tags?: ReadonlyArray<string>;

  /** If true, this entity doesn't get cleaned up when the scene is cleared */
  readonly persistenceLevel: number;

  /** True if this entity will stop updating when the game is paused. */
  readonly pausable: boolean;

  /** Called to remove this entity from the game */
  destroy(): void;

  sprite?: GameSprite;
  sprites?: GameSprite[];
}

export interface WithOwner {
  owner?: Entity;
}
