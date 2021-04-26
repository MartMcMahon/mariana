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

  // start down a ways so we don't have fish spawning right at the surface
  let topLeft = V((-REGION_WIDTH * numColumns) / 2, 5);
  let rdata: any;

  let regionsData: any[][] = [];

  for (let depthLevel = 0; depthLevel < numRows; depthLevel++) {
    regionsData.push([]);

    for (let column = 0; column < numColumns; column++) {
      if (column == 0 && depthLevel == 0) {
        rdata = data.start;
      } else if (depthLevel == 0) {
        let filteredRegions = data.regions.filter(
          (r: any) => r.left == rdata.right
        );

        rdata = filteredRegions[rInteger(0, filteredRegions.length)];
      } else {
        rdata = data.regions[3];
      }

      regionsData[depthLevel].push(rdata);

      const cellData = getRegionCSV(rdata.csv);
      const regionX = topLeft.x + column * REGION_WIDTH;
      const regionY = topLeft.y + depthLevel * REGION_HEIGHT;
      regions.push(new Region(V(regionX, regionY), cellData, depthLevel));
    }
  }

  return regions;
}
