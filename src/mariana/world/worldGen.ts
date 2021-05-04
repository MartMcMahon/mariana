import { makeNoise2D } from "fast-simplex-noise";
import Grid from "../../core/util/Grid";
import { lerp } from "../../core/util/MathUtil";
import { WORLD_SIZE_TILES } from "../constants";

export function generateSolidMap(): Grid<boolean> {
  const solidMap: Grid<boolean> = new Grid();

  // const noise = makeNoise2D();
  const noise = makeNoise2D();

  const minX = Math.floor(-WORLD_SIZE_TILES[0] / 2);
  const maxX = Math.floor(WORLD_SIZE_TILES[0] / 2);
  for (let x = minX; x < maxX; x++) {
    const n = (noise(x * 0.1, 0) + 1) / 2;
    let minY = Math.floor(lerp(10, 40, n));
    const maxY = 100;
    for (let y = minY; y < maxY; y++) {
      solidMap.set([x, y], true);
    }
  }

  return solidMap;
}
