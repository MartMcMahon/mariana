import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { V, V2d } from "../../core/Vector";
import { WorldMap } from "./WorldMap";

/** Keeps certain tiles loaded */
export class WorldAnchor extends BaseEntity implements Entity {
  constructor(
    public getCenter: () => V2d,
    public width: number = 1,
    public height: number = 1
  ) {
    super();
  }

  getTilesToLoad(map: WorldMap): V2d[] {
    const tiles: V2d[] = [];
    const [x, y] = map.worldToTile(this.getCenter());
    for (let i = -this.width; i <= this.width; i++) {
      for (let j = -this.height; j <= this.height; j++) {
        tiles.push(V(x + i, y + j));
      }
    }
    return tiles;
  }
}

export function isWorldAnchor(entity: Entity): entity is WorldAnchor {
  return entity instanceof WorldAnchor;
}
