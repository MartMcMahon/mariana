import img_stoneTiles2 from "../../../resources/images/tiles/stone_tiles2.png";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { rInteger, shuffle } from "../../core/util/Random";
import { V, V2d } from "../../core/Vector";
import { TILE_SIZE_METERS } from "../constants";
import { AnglerFish } from "../enemies/AnglerFish";
import { Jellyfish } from "../enemies/Jellyfish";
import { PufferFish } from "../enemies/PufferFish";
import { Shark } from "../enemies/Shark";
import { StingRay } from "../enemies/StingRay";
import { GroundTile } from "./GroundTile";
import { RegionCSVData } from "./RegionData";
import { Tileset } from "./Tileset";

export class Region extends BaseEntity implements Entity {
  persistenceLevel = 1;

  // Cells that don't have land in them
  emptyCells: V2d[] = [];

  numJellyfish: number;
  numPufferFish: number;
  numSharks: number;
  numStingRays: number;
  numAnglerFish: number;

  constructor(
    origin: V2d = V(0, 0),
    cellData: RegionCSVData,
    tileset: Tileset,
    depthLevel: number
  ) {
    super();

    cellData.forEach((row, j) =>
      row.forEach((tileType, i) => {
        const x = i * TILE_SIZE_METERS;
        const y = j * TILE_SIZE_METERS;
        const position = origin.add([x, y]);

        if (tileType >= 0) {
          this.addChild(new GroundTile(position, tileset, tileType));
        } else {
          this.emptyCells.push(position);
        }
      })
    );

    // The number that will spawn
    this.numJellyfish = rInteger(2, 10);
    this.numPufferFish = rInteger(0, 2);
    this.numSharks = depthLevel > 1 ? rInteger(0, 2) : 0;
    this.numStingRays = depthLevel < 2 ? rInteger(0, 2) : 0;
    this.numAnglerFish = depthLevel > 2 ? rInteger(1, 2) : 0;

    this.spawnFishes();
  }

  spawnFishes() {
    // keep track
    const spawnCells = [...this.emptyCells];
    shuffle(spawnCells);

    for (let i = 0; i < this.numJellyfish && spawnCells.length > 0; i++) {
      const [x, y] = spawnCells.pop()!;
      this.addChild(new Jellyfish(V(x, y)));
    }

    for (let i = 0; i < this.numPufferFish && spawnCells.length > 0; i++) {
      const [x, y] = spawnCells.pop()!;
      this.addChild(new PufferFish(V(x, y)));
    }

    for (let i = 0; i < this.numSharks && spawnCells.length > 0; i++) {
      const [x, y] = spawnCells.pop()!;
      this.addChild(new Shark(V(x, y)));
    }

    for (let i = 0; i < this.numStingRays && spawnCells.length > 0; i++) {
      const [x, y] = spawnCells.pop()!;
      this.addChild(new StingRay(V(x, y)));
    }

    for (let i = 0; i < this.numAnglerFish && spawnCells.length > 0; i++) {
      const [x, y] = spawnCells.pop()!;
      this.addChild(new AnglerFish(V(x, y)));
    }
  }

  // TODO: Loading and unloading when players get near

  handlers = {
    diveStart: () => {},
  };
}
