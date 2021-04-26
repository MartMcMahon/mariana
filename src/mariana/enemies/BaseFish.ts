import { Body, Box } from "p2";
import { Sprite } from "pixi.js";
import snd_fleshHit1 from "../../../resources/audio/flesh-hit-1.flac";
import snd_fleshHit2 from "../../../resources/audio/flesh-hit-2.flac";
import snd_fleshHit3 from "../../../resources/audio/flesh-hit-3.flac";
import snd_fleshHit4 from "../../../resources/audio/flesh-hit-4.flac";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { SoundInstance } from "../../core/sound/SoundInstance";
import { choose, rInteger, rNormal, rUniform } from "../../core/util/Random";
import { V, V2d } from "../../core/Vector";
import { CollisionGroups } from "../config/CollisionGroups";
import { BloodSplash } from "../effects/BloodSplash";
import { makeSoulDrops, FishSoul } from "../FishSoul";
import { Harpoon } from "../weapons/Harpoon";
import { Harpoonable } from "../weapons/Harpoonable";

interface Options {
  width: number;
  height: number;
  speed?: number;
  friction?: number;
  dropValue?: number;
  hp?: number;
}

export abstract class BaseFish
  extends BaseEntity
  implements Entity, Harpoonable {
  sprite!: Sprite & GameSprite;
  body: Body;
  facingRight = true;

  width: number;
  height: number;
  speed: number;
  friction: number;
  dropValue: number;
  hp: number;

  constructor(
    position: V2d,
    { width, height, speed = 3, friction = 2, dropValue = 1, hp = 10 }: Options
  ) {
    super();

    this.width = width;
    this.height = height;
    this.speed = speed;
    this.friction = friction;
    this.dropValue = dropValue;
    this.hp = hp;

    this.body = new Body({ mass: 1 });
    this.body.addShape(
      new Box({
        width,
        height,
        collisionMask: CollisionGroups.All,
      })
    );
    this.body.position = position;
  }

  onTick(dt: number) {
    this.body.applyForce(V(this.body.velocity).imul(-this.friction));

    // gravity when above water
    if (this.body.position[1] < 0) {
      this.body.applyForce([0, 9.8 * this.body.mass]);
    }
  }

  onRender(dt: number) {
    this.sprite.position.set(...this.body!.position);

    const scale = this.width / this.sprite.texture.width;
    if (this.facingRight) {
      this.sprite.scale.set(-scale, scale);
    } else {
      this.sprite.scale.set(scale, scale);
    }
  }

  // Moves the fish
  swim(direction: V2d, speed = this.speed) {
    this.sprite.scale.set(this.width / this.sprite.texture.width);
    this.facingRight = direction[0] > 0;
    this.body.applyForce(direction.mul(speed));
  }

  // when we're hit
  onHarpooned(harpoon: Harpoon) {
    const damage = harpoon.getDamageAmount();
    if (damage > 0) {
      this.game!.addEntity(makeSoulDrops(this.getPosition(), this.dropValue));
      const sound = choose(
        snd_fleshHit1,
        snd_fleshHit2,
        snd_fleshHit3,
        snd_fleshHit4
      );
      this.game!.addEntity(new SoundInstance(sound));
      this.game!.addEntity(
        new BloodSplash(
          this.getPosition(),
          harpoon.getVelocity().imul(0.1),
          undefined,
          rUniform(0.4, 0.6)
        )
      );

      this.hp -= damage;
      if (this.hp <= 0) {
        this.die();
      }
    }
  }

  die() {
    this.game!.addEntity(new BloodSplash(this.getPosition()));
    this.game!.addEntity(
      new BloodSplash(
        this.getPosition(),
        V(this.body.velocity),
        undefined,
        rUniform(0.7, 1.1)
      )
    );
    this.destroy();
  }
}
