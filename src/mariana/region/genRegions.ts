import data from "../../../resources/regions/regions.json";
import { rInteger } from "../../core/util/Random";
import { V } from "../../core/Vector";
import { GROUND_TILE_SIZE } from "./GroundTile";
import { Region } from "./Region";
import { getRegionCSV } from "./RegionData";

const REGION_WIDTH = 16 * GROUND_TILE_SIZE; // width in meters
const REGION_HEIGHT = 16 * GROUND_TILE_SIZE; // height in meters

// Generates all the regions
export function genRegions(
  // How many rows of regions
  numRows: number = 3,
  // how many regions in each row
  numColumns = 4
) {
  let regions = [];

  let pos = V((-REGION_WIDTH * numColumns) / 2, 0);
  let rdata: any;

  let regionsData: any[][] = [];

  for (let y = 0; y < numRows; y++) {
    regionsData.push([]);

    for (let x = 0; x < numColumns; x++) {
      if (x == 0 && y == 0) {
        rdata = data.start;
      } else if (y == 0) {
        let filteredRegions = data.regions.filter(
          (r: any) => r.left == rdata.right
        );

        rdata = filteredRegions[rInteger(0, filteredRegions.length)];
      } else {
        rdata = data.regions[3];
      }

      regionsData[y].push(rdata);

      const cellData = getRegionCSV(rdata.csv);
      regions.push(
        new Region(V(pos.x + x * REGION_WIDTH, y * REGION_HEIGHT), cellData)
      );
    }
  }

  return regions;
}
