import { BaseTexture, Rectangle, SCALE_MODES, Texture } from "pixi.js";

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
