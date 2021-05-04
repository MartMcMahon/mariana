import Grid from "../../core/util/Grid";
import { rInteger } from "../../core/util/Random";
import { WORLD_SIZE_TILES } from "../constants";

export function generateSolidMap(): Grid<boolean> {
  const solidMap: Grid<boolean> = new Grid();

  const minX = Math.floor(-WORLD_SIZE_TILES[0] / 2);
  const maxX = Math.floor(WORLD_SIZE_TILES[0] / 2);
  for (let x = minX; x < maxX; x++) {
    let minY = rInteger(10, 30);
    const maxY = 100;
    for (let y = minY; y < maxY; y++) {
      solidMap.set([x, y], true);
    }
  }

  return solidMap;
}
