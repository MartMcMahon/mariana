import Entity from "../../core/entity/Entity";
import { Harpoon } from "./Harpoon";

export interface Harpoonable {
  onHarpooned(harpoon: Harpoon): void;
}

export function isHarpoonable(other?: Entity): other is Harpoonable & Entity {
  if (other) {
    if ((other as any).onHarpooned) {
      return true;
    }
  }
  return false;
}
