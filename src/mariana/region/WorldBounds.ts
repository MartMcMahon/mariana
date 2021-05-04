import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { V } from "../../core/Vector";
import {
  TILE_SIZE_METERS,
  WORLD_BOTTOM,
  WORLD_LEFT_EDGE,
  WORLD_RIGHT_EDGE,
} from "../constants";
import { Tileset } from "../utils/Tileset";
import { GroundTile } from "./GroundTile";

export class WorldBounds extends BaseEntity implements Entity {
  constructor(tileset: Tileset) {
    super();

    const lx = WORLD_LEFT_EDGE - TILE_SIZE_METERS / 3;
    const rx = WORLD_RIGHT_EDGE - TILE_SIZE_METERS / 3;

    for (let depth = 0; depth < WORLD_BOTTOM; depth += TILE_SIZE_METERS) {
      this.addChild(new GroundTile(V(lx, depth), tileset, 5));
      this.addChild(new GroundTile(V(rx, depth), tileset, 3));
    }

    this.addChild(new GroundTile(V(lx, -TILE_SIZE_METERS), tileset, 2));
    this.addChild(new GroundTile(V(rx, -TILE_SIZE_METERS), tileset, 0));

    for (let x = WORLD_LEFT_EDGE; x < WORLD_RIGHT_EDGE; x += TILE_SIZE_METERS) {
      this.addChild(new GroundTile(V(x, WORLD_BOTTOM), tileset, 1));
    }
  }
}
