import { settings as PixiTilemapSettings } from "@pixi/tilemap";
import { BaseTexture, Rectangle, SCALE_MODES, Texture } from "pixi.js";
import img_referenceTileset from "../../../resources/images/tiles/reference-tileset.png";
import { makeBitfield } from "../../core/util/bitfield";

const textureCache = new Map<string, Texture>();

function getOrMakeTexture(url: string): Texture {
  if (!textureCache.has(url)) {
    textureCache.set(url, Texture.from(url));
  }
  return textureCache.get(url)!;
}

interface Options {
  // width/height in pixels
  tileSize?: number;
  columns?: number;
  rows?: number;
  // pixels between tiles
  gap?: number;
}

export class Tileset {
  baseTexture: BaseTexture;

  tiles: Texture[] = [];

  constructor(
    imageUrl: string,
    { tileSize = 64, columns = 3, rows = 6, gap = 1 }: Options = {}
  ) {
    this.baseTexture = (getOrMakeTexture(imageUrl) as any) as BaseTexture;

    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        const x = column * (tileSize + gap);
        const y = row * (tileSize + gap);
        const frame = new Rectangle(x, y, tileSize, tileSize);
        const texture = new Texture(this.baseTexture, frame);
        texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
        //
        this.tiles.push(texture);
      }
    }
  }

  getTexture(i: number) {
    return this.tiles[i];
  }
}

let defaultTileset: Tileset | undefined = undefined;
export function getDefaultTileset(): Tileset {
  if (!defaultTileset) {
    defaultTileset = new Tileset(img_referenceTileset, {
      columns: 6,
      rows: 6,
      gap: 1,
    });

    PixiTilemapSettings.TEXTURES_PER_TILEMAP = 32;
    PixiTilemapSettings.use32bitIndex = true;
  }
  return defaultTileset;
}

interface Neighbors {
  topLeft: boolean;
  top: boolean;
  topRight: boolean;
  left: boolean;
  middle: boolean;
  right: boolean;
  bottomLeft: boolean;
  bottom: boolean;
  bottomRight: boolean;
}

// See tileset_reference.png
export function getTileType(neighbors: Neighbors): number {
  if (!neighbors.middle) {
    return -1;
  }

  const { left, top, right, bottom } = neighbors;
  const { topLeft, topRight, bottomRight, bottomLeft } = neighbors;
  // turns it into a bitfield
  const sides = makeBitfield(left, top, right, bottom);
  const corners = makeBitfield(topLeft, topRight, bottomRight, bottomLeft);

  switch (sides) {
    // Inside
    case 0b1111:
      switch (corners) {
        // inside single corners
        case 0b1101:
          return 18;
        case 0b1110:
          return 19;
        case 0b1011:
          return 24;
        case 0b0111:
          return 25;

        // Double inside courners
        case 0b0101:
          return 20;
        case 0b1010:
          return 26;
        case 0b0011:
          return 30;
        case 0b1001:
          return 31;
        case 0b1100:
          return 32;
        case 0b0110:
          return 3;

        // Triple inside courners
        case 0b0010:
          return 4;
        case 0b0001:
          return 5;
        case 0b1000:
          return 10;
        case 0b00100:
          return 11;

        // All corners
        case 0b0000:
          return 9;

        // middle tile
        default:
          return 7;
      }

    // Outer corners
    case 0b0011:
      return 0;
    case 0b1001:
      return 2;
    case 0b0110:
      return 12;
    case 0b1100:
      return 14;

    // outer side
    case 0b1011:
      return 1;
    case 0b0111:
      return 6;
    case 0b1101:
      return 8;
    case 0b1110:
      return 13;

    // Lone block
    case 0b0000:
      return 22;

    // Protrusions
    case 0b1000:
      return 17;
    case 0b0100:
      return 33;
    case 0b0010:
      return 15;
    case 0b0001:
      return 21;

    // Bridges
    case 0b1010:
      return 27;
    case 0b0101:
      return 16;

    default:
      throw new Error(`unknown bitfield: ${sides}`);
  }
}
