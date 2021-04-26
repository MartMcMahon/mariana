import img_stoneTiles2 from "../../../resources/images/tiles/stone_tiles2.png";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { rBool, rInteger, shuffle } from "../../core/util/Random";
import { V, V2d } from "../../core/Vector";
import { AnglerFish } from "../enemies/AnglerFish";
import { Jellyfish } from "../enemies/Jellyfish";
import { PufferFish } from "../enemies/PufferFish";
import { Shark } from "../enemies/Shark";
import { StingRay } from "../enemies/StingRay";
import { GroundTile, GROUND_TILE_SIZE } from "./GroundTile";
import { getRegionCSV, RegionCSVData } from "./RegionData";
import { Tileset } from "./Tileset";

export class Region extends BaseEntity implements Entity {
  constructor(
    origin: V2d = V(0, 0),
    cellData: RegionCSVData,
    depthLevel: number
  ) {
    super();

    // TODO: Not the same tileset for every region
    const tileset = new Tileset(img_stoneTiles2, {
      columns: 3,
      rows: 6,
      gap: 1,
    });

    const emptyCells: V2d[] = [];

    cellData.forEach((row, j) =>
      row.forEach((tileType, i) => {
        const x = i * GROUND_TILE_SIZE;
        const y = j * GROUND_TILE_SIZE;
        const position = origin.add([x, y]);

        if (tileType >= 0) {
          this.addChild(new GroundTile(position, tileset, tileType));
        } else {
          emptyCells.push(position);
        }
      })
    );

    shuffle(emptyCells);

    const numJellyfish = rInteger(2, 10);
    const numPufferFish = rInteger(0, 2);
    const numSharks = depthLevel > 1 ? rInteger(0, 2) : 0;
    const numStingRays = depthLevel < 2 ? rInteger(0, 2) : 0;
    const numAnglerFish = depthLevel > 2 ? rInteger(1, 2) : 0;

    for (let i = 0; i < numJellyfish && emptyCells.length > 0; i++) {
      const [x, y] = emptyCells.pop()!;
      this.addChild(new Jellyfish(V(x, y)));
    }

    for (let i = 0; i < numPufferFish && emptyCells.length > 0; i++) {
      const [x, y] = emptyCells.pop()!;
      this.addChild(new PufferFish(V(x, y)));
    }

    for (let i = 0; i < numSharks && emptyCells.length > 0; i++) {
      const [x, y] = emptyCells.pop()!;
      this.addChild(new Shark(V(x, y)));
    }

    for (let i = 0; i < numStingRays && emptyCells.length > 0; i++) {
      const [x, y] = emptyCells.pop()!;
      this.addChild(new StingRay(V(x, y)));
    }

    for (let i = 0; i < numAnglerFish && emptyCells.length > 0; i++) {
      const [x, y] = emptyCells.pop()!;
      this.addChild(new AnglerFish(V(x, y)));
    }
  }
}
