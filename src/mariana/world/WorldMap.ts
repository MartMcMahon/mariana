import { CompositeTilemap } from "@pixi/tilemap";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../core/entity/Entity";
import Game from "../../core/Game";
import Grid from "../../core/util/Grid";
import { V, V2d } from "../../core/Vector";
import { Layer } from "../config/layers";
import { TILE_SIZE_METERS, WORLD_SIZE_TILES } from "../constants";
import { GroundTile } from "../region/GroundTile";
import { getDefaultTileset, getTileType } from "../utils/Tileset";
import { isWorldAnchor } from "./WorldAnchor";
import { generateSolidMap } from "./worldGen";

type TilePos = V2d;
type TilePosString = `${number},${number}`;

/** Keeps track of all the tiles and stuff */
export class WorldMap extends BaseEntity implements Entity {
  id = "worldMap";

  solidMap: Grid<boolean> = new Grid();
  tilesLoaded = new Set<TilePosString>();
  tileEntities: Grid<Entity[]> = new Grid();

  sprite!: CompositeTilemap & GameSprite;

  constructor(
    public leftBound = -WORLD_SIZE_TILES[0] / 2,
    public rightBound = WORLD_SIZE_TILES[0] / 2,
    public bottomBound = WORLD_SIZE_TILES[1]
  ) {
    super();

    this.sprite = new CompositeTilemap();
    this.sprite.layerName = Layer.WORLD_BACK;
    this.sprite.scale.set(TILE_SIZE_METERS / 64);
    this.solidMap = generateSolidMap();
  }

  onAdd(game: Game) {
    // Make sure we can find the WorldAnchors quickly
    game.entities.addFilter(isWorldAnchor);
  }

  tileIsSolid(tilePos: TilePos): boolean {
    const [x, y] = tilePos;
    if (x < this.leftBound) {
      return true;
    } else if (x > this.rightBound) {
      return true;
    } else if (y > this.bottomBound) {
      return true;
    }
    return this.solidMap.get(tilePos) ?? false;
  }

  getTileType(tilePos: TilePos): number {
    return getTileType({
      middle: this.tileIsSolid(tilePos),
      left: this.tileIsSolid(tilePos.add([-1, 0])),
      top: this.tileIsSolid(tilePos.add([0, -1])),
      right: this.tileIsSolid(tilePos.add([1, 0])),
      bottom: this.tileIsSolid(tilePos.add([0, 1])),
      topLeft: this.tileIsSolid(tilePos.add([-1, -1])),
      topRight: this.tileIsSolid(tilePos.add([1, -1])),
      bottomLeft: this.tileIsSolid(tilePos.add([-1, 1])),
      bottomRight: this.tileIsSolid(tilePos.add([1, 1])),
    });
  }

  loadTile(tilePos: TilePos): void {
    if (!this.tilesLoaded.has(tileToString(tilePos))) {
      this.tilesLoaded.add(tileToString(tilePos));

      const isSolid = this.tileIsSolid(tilePos);

      if (isSolid) {
        const worldPos = this.tileToWorld(tilePos);
        const tileset = getDefaultTileset();
        const tileType = this.getTileType(tilePos);
        const groundTile = new GroundTile(worldPos, tileset, tileType);
        this.addChild(groundTile);
        this.tileEntities.set(tilePos, [groundTile]);

        const [tx, ty] = tilePos.mul(64);
        this.sprite.tile(tileset.getTexture(tileType), tx, ty);
      }
    }
  }

  unloadTile(tilePos: TilePos): void {
    // this.tileEntities.set;
    this.tilesLoaded.delete(tileToString(tilePos));

    for (const entity of this.tileEntities.get(tilePos) ?? []) {
      entity.destroy();
    }

    this.tileEntities.delete(tilePos);
  }

  /** Get the tile that a world position is in */
  worldToTile(worldPos: V2d): V2d {
    const tilePos = worldPos.mul(1 / TILE_SIZE_METERS);
    tilePos[0] = Math.floor(tilePos[0]);
    tilePos[1] = Math.floor(tilePos[1]);
    return tilePos;
  }

  /** Get the center of a world tile */
  tileToWorld(tilePos: TilePos): V2d {
    return V(tilePos).iadd([0.5, 0.5]).imul(TILE_SIZE_METERS);
  }

  onTick() {
    // get tilesToLoad
    const tilesToLoad: TilePos[] = [];
    for (const anchor of this.game!.entities.getByFilter(isWorldAnchor)) {
      tilesToLoad.push(...anchor.getTilesToLoad(this));
    }

    // put tiles loaded into set tilesToUnload
    const tilesToUnload = new Set<TilePosString>();
    for (const tile of this.tilesLoaded) {
      tilesToUnload.add(tile);
    }

    // for each tile of tilesToLoad
    for (const tile of tilesToLoad) {
      //   remove tile from tilesToUnload
      tilesToUnload.delete(tileToString(tile));
      //   if tile isn't loaded: load it
      if (!this.tilesLoaded.has(tileToString(tile))) {
        this.loadTile(tile);
      }
    }

    // for each tile of tilesToUnload
    for (const tileString of tilesToUnload) {
      const tile = stringToTile(tileString);
      this.unloadTile(tile);
    }
  }
}

function tileToString([x, y]: TilePos): TilePosString {
  return `${x},${y}` as TilePosString;
}

function stringToTile(s: TilePosString): TilePos {
  const [x, y] = s.split(",");
  return V(parseInt(x), parseInt(y));
}

export function getWorldMap(game?: Game): WorldMap | undefined {
  return game?.entities.getById("worldMap") as WorldMap;
}
