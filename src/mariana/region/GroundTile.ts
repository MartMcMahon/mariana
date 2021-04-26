import { Body, Box } from "p2";
import { Sprite } from "pixi.js";
import snd_harpoonHitGround1 from "../../../resources/audio/harpoon_hit_ground_1.flac";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { SoundInstance } from "../../core/sound/SoundInstance";
import { V, V2d } from "../../core/Vector";
import { CollisionGroups } from "../config/CollisionGroups";
import { Harpoonable } from "../weapons/Harpoonable";
import { Tileset } from "./Tileset";

export const GROUND_TILE_SIZE = 2.25;

export class GroundTile extends BaseEntity implements Entity, Harpoonable {
  sprite: Sprite;

  constructor(position: V2d, tileset: Tileset, tileType: number) {
    super();

    let texture = tileset.getTexture(tileType);

    this.sprite = Sprite.from(texture);
    this.sprite.width = this.sprite.height = GROUND_TILE_SIZE;
    this.sprite.position.set(...position);
    this.sprite.anchor.set(0.5);

    this.body = new Body({ mass: 0, position: position.clone() });
    this.body.addShape(
      new Box({
        width: GROUND_TILE_SIZE,
        height: GROUND_TILE_SIZE,
        collisionMask: CollisionGroups.All,
      })
    );
  }

  onHarpooned() {
    this.game!.addEntity(new SoundInstance(snd_harpoonHitGround1));
  }
}
