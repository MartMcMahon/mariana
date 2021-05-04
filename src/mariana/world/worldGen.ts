import { makeNoise2D } from "fast-simplex-noise";
import Grid from "../../core/util/Grid";
import { degToRad, lerp } from "../../core/util/MathUtil";
import {
  rBool,
  rInteger,
  rNormal,
  rSign,
  rUniform,
} from "../../core/util/Random";
import { V } from "../../core/Vector";
import { WORLD_SIZE_TILES } from "../constants";

const JAGGEDNESS = 0.01;

const MIN_X = Math.floor(-WORLD_SIZE_TILES[0] / 2);
const MAX_X = Math.floor(WORLD_SIZE_TILES[0] / 2);
const MAX_Y = 1000;

export function generateSolidMap(): Grid<boolean> {
  console.time("worldGen");
  const solidMap: Grid<boolean> = new Grid();

  generateSurface(solidMap);

  doTunnel(solidMap);
  doTunnel(solidMap);
  doTunnel(solidMap);

  console.timeEnd("worldGen");

  return solidMap;
}

function generateSurface(solidMap: Grid<boolean>): void {
  const noise = makeNoise2D();

  // TODO: mountain?

  for (let x = MIN_X; x < MAX_X; x++) {
    const n = (noise(x * JAGGEDNESS, 0) + 1) / 2;
    const n2 = (noise(5 + x * JAGGEDNESS * 20, 10) + 1) / 2;
    let minY = Math.floor(lerp(10, 40, n) + lerp(-3, 3, n2));
    for (let y = minY; y < MAX_Y; y++) {
      solidMap.set([x, y], true);
    }
  }
}

function doTunnel(
  solidMap: Grid<boolean>,
  x = rInteger(MIN_X, MAX_X),
  y = 5,
  r = rUniform(1.5, 4),
  direction = rUniform(0, Math.PI),
  branchChance = r / 10
) {
  while (r > 1 && y > 0 && y < MAX_Y && x > MIN_X && x < MAX_X) {
    removeCircle(solidMap, Math.round(x), Math.round(y), Math.round(r));
    x += r * Math.cos(direction);
    y += r * Math.sin(direction);
    direction += rNormal(0, degToRad(30));
    r += rNormal(0, 1);

    if (rBool(branchChance)) {
      doTunnel(
        solidMap,
        x,
        y,
        r / 2,
        direction + rSign() * Math.PI,
        branchChance * 0.5
      );
      branchChance *= 0.9;
    }
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
