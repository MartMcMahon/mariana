import data from "../../../resources/regions/regions.json";
import { rInteger } from "../../core/util/Random";
import { V } from "../../core/Vector";
import {
  REGIONS_START_DEPTH,
  REGION_SIZE_METERS,
  WORLD_LEFT_EDGE,
  WORLD_SIZE_REGIONS,
} from "../constants";
import { Region } from "./Region";
import { getRegionCSV } from "./RegionData";

// Generates all the regions
export function generateRegions() {
  let regions = [];

  const [numColumns, numRows] = WORLD_SIZE_REGIONS;

  // start down a ways so we don't have fish spawning right at the surface
  let topLeft = V(WORLD_LEFT_EDGE, REGIONS_START_DEPTH);
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
      const regionX = topLeft.x + column * REGION_SIZE_METERS[0];
      const regionY = topLeft.y + depthLevel * REGION_SIZE_METERS[1];
      regions.push(new Region(V(regionX, regionY), cellData, depthLevel));
    }
  }

  return regions;
}
