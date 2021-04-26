import { Body, Box, vec2 } from "p2";
import { Sprite } from "pixi.js";
import snd_metalHittingRock from "../../../resources/audio/metal_hitting_rock.flac";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { SoundInstance } from "../../core/sound/SoundInstance";
import { clamp } from "../../core/util/MathUtil";
import { rUniform } from "../../core/util/Random";
import { V2d } from "../../core/Vector";
import { CollisionGroups } from "../config/CollisionGroups";
import { Harpoon } from "../weapons/Harpoon";
import { Harpoonable } from "../weapons/Harpoonable";
import { Tileset } from "./Tileset";

export const GROUND_TILE_SIZE = 2.25;

export class GroundTile extends BaseEntity implements Entity, Harpoonable {
  persistenceLevel = 1;
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

  onHarpooned(harpoon: Harpoon) {
    const gain = clamp(vec2.length(harpoon.body.velocity) / 12) / 10;
    this.game!.addEntity(
      new SoundInstance(snd_metalHittingRock, {
        gain,
        speed: rUniform(0.9, 1.1),
      })
    );
  }
}
