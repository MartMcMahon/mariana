import { V } from "../core/Vector";

export const OCEAN_DEPTH: number = 100; // 11034; // Depth of the Mariana Trench in meters

export const TILE_SIZE_METERS = 2.25; // size of a tile in meters x meters
export const REGION_SIZE_TILES = V(16, 16); // size of a region in tiles x tiles
export const WORLD_SIZE_REGIONS = V(3, 6); // size of the world in regions x regions
// size of a region in meters x meters
export const REGION_SIZE_METERS = V(
  REGION_SIZE_TILES[0] * TILE_SIZE_METERS,
  REGION_SIZE_TILES[1] * TILE_SIZE_METERS
);
// size of the world in tiles x tiles
export const WORLD_SIZE_TILES = V(
  WORLD_SIZE_REGIONS[0] * REGION_SIZE_TILES[0],
  WORLD_SIZE_REGIONS[1] * REGION_SIZE_TILES[1]
);
// size of the world in meters x meters
export const WORLD_SIZE_METERS = V(
  WORLD_SIZE_REGIONS[0] * REGION_SIZE_METERS[0],
  WORLD_SIZE_REGIONS[1] * REGION_SIZE_METERS[1]
);

export const REGIONS_START_DEPTH = 5; // depth in meters of the first region
export const WORLD_LEFT_EDGE = -0.5 * WORLD_SIZE_METERS[0];
export const WORLD_RIGHT_EDGE = 0.5 * WORLD_SIZE_METERS[0];
export const WORLD_BOTTOM = WORLD_SIZE_METERS[1] + REGIONS_START_DEPTH;
