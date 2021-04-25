import { BaseTexture, Rectangle, Texture } from "pixi.js";

export class Tileset {
  baseTexture: BaseTexture;

  tiles: Texture[] = [];

  constructor(
    imageUrl: string,
    tileSize: number = 64,
    numColumns: number = 3,
    numRows: number = 3
  ) {
    this.baseTexture = (Texture.from(imageUrl) as any) as BaseTexture;

    for (let row = 0; row < numRows; row++) {
      for (let column = 0; column < numColumns; column++) {
        const x = column * tileSize;
        const y = column * tileSize;
        const frame = new Rectangle(x, y, tileSize, tileSize);
        const texture = new Texture(this.baseTexture, frame);
        //
        this.tiles.push(texture);
      }
    }
  }

  getTexture(i: number) {
    return this.tiles[i];
  }
}
