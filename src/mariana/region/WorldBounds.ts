import img_stoneTiles2 from "../../../resources/images/tiles/stone_tiles2.png";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { V } from "../../core/Vector";
import {
  TILE_SIZE_METERS,
  WORLD_BOTTOM,
  WORLD_LEFT_EDGE,
  WORLD_RIGHT_EDGE,
} from "../constants";
import { GroundTile } from "./GroundTile";
import { Tileset } from "./Tileset";

export class WorldBounds extends BaseEntity implements Entity {
  constructor(tileset: Tileset) {
    super();

    for (let depth = 0; depth < WORLD_BOTTOM; depth += TILE_SIZE_METERS) {
      this.addChild(
        new GroundTile(
          V(WORLD_LEFT_EDGE - TILE_SIZE_METERS / 3, depth),
          tileset,
          5
        )
      );
      this.addChild(
        new GroundTile(
          V(WORLD_RIGHT_EDGE + TILE_SIZE_METERS / 3, depth),
          tileset,
          3
        )
      );
    }

    this.addChild(
      new GroundTile(V(WORLD_LEFT_EDGE, -TILE_SIZE_METERS), tileset, 2)
    );
    this.addChild(
      new GroundTile(V(WORLD_RIGHT_EDGE, -TILE_SIZE_METERS), tileset, 0)
    );

    for (let x = WORLD_LEFT_EDGE; x < WORLD_RIGHT_EDGE; x += TILE_SIZE_METERS) {
      this.addChild(new GroundTile(V(x, WORLD_BOTTOM), tileset, 1));
    }
  }
}
