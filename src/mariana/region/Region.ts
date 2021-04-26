import img_stoneTiles2 from "../../../resources/images/tiles/stone_tiles2.png";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { V, V2d } from "../../core/Vector";
import { GroundTile, GROUND_TILE_SIZE } from "./GroundTile";
import { getRegionCSV, RegionCSVData } from "./RegionData";
import { Tileset } from "./Tileset";

export class Region extends BaseEntity implements Entity {
  constructor(origin: V2d = V(0, 0), cellData: RegionCSVData) {
    super();

    // TODO: Not the same tileset for every region
    const tileset = new Tileset(img_stoneTiles2, {
      columns: 3,
      rows: 6,
      gap: 1,
    });

    cellData.forEach((row, j) =>
      row.forEach((tileType, i) => {
        if (tileType >= 0) {
          const x = i * GROUND_TILE_SIZE;
          const y = j * GROUND_TILE_SIZE;
          this.addChild(new GroundTile(origin.add([x, y]), tileset, tileType));
        }
      })
    );
  }
}
