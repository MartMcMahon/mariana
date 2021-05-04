import { makeNoise2D } from "fast-simplex-noise";
import Grid from "../../core/util/Grid";
import { degToRad, lerp } from "../../core/util/MathUtil";
import { rInteger, rNormal, rUniform } from "../../core/util/Random";
import { V } from "../../core/Vector";
import { WORLD_SIZE_TILES } from "../constants";

const JAGGEDNESS = 0.01;

const MIN_X = Math.floor(-WORLD_SIZE_TILES[0] / 2);
const MAX_X = Math.floor(WORLD_SIZE_TILES[0] / 2);

export function generateSolidMap(): Grid<boolean> {
  const solidMap: Grid<boolean> = new Grid();

  generateSurface(solidMap);

  doTunnel(solidMap);
  doTunnel(solidMap);
  doTunnel(solidMap);

  return solidMap;
}

function generateSurface(solidMap: Grid<boolean>): void {
  const noise = makeNoise2D();

  // TODO: mountain?

  for (let x = MIN_X; x < MAX_X; x++) {
    const n = (noise(x * JAGGEDNESS, 0) + 1) / 2;
    let minY = Math.floor(lerp(10, 20, n));
    const maxY = 100;
    for (let y = minY; y < maxY; y++) {
      solidMap.set([x, y], true);
    }
  }
}

function doTunnel(solidMap: Grid<boolean>) {
  let x = rInteger(MIN_X, MAX_X);
  let y = 5;
  let r = rUniform(1.5, 4);
  let direction = rUniform(0, Math.PI);

  while (r > 0 && y > 0 && y < 100 && x > MIN_X && x < MAX_X) {
    removeCircle(solidMap, Math.round(x), Math.round(y), Math.round(r));
    x += r * Math.cos(direction);
    y += r * Math.sin(direction);
    direction += rNormal(0, degToRad(10));
    r += rNormal(0, 0.5);
  }

  // TODO: Branching
}

function removeCircle(
  solidMap: Grid<boolean>,
  cx: number,
  cy: number,
  r: number
): void {
  const rCeil = Math.ceil(r);
  for (let i = cx - rCeil; i < cx + rCeil; i++) {
    for (let j = cy - rCeil; j < cy + rCeil; j++) {
      if (V(cx, cy).isub([i, j]).magnitude < r) {
        solidMap.set([i, j], false);
      }
    }
  }
}
