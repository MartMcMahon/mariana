import { Body, Capsule } from "p2";
import { Sprite, Texture } from "pixi.js";
import snd_ding from "../../../resources/audio/ding.flac";
import snd_sharkMiss from "../../../resources/audio/shark-miss.flac";
import snd_sharkbite from "../../../resources/audio/sharkbite.flac";
import img_sharkAggro from "../../../resources/images/shark_aggro.png";
import img_sharkBite from "../../../resources/images/shark_bite.png";
import img_sharkPatrol from "../../../resources/images/shark_patrol.png";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { SoundInstance } from "../../core/sound/SoundInstance";
import { rBool } from "../../core/util/Random";
import { V, V2d } from "../../core/Vector";
import { CollisionGroups } from "../config/CollisionGroups";
import { Diver } from "../Diver";

const PATROL_SPEED = 3.5; // speed when patrolling
const AGGRO_SPEED = 4.5; // speed when aggroed
const FRICTION = 2.0; // water friction
const PATROL_TIME = 5.0; // seconds between turning around when patrolling

const WINDUP_TIME = 0.15; // seconds from when mouth is open to damage is done
const COOLDOWN_TIME = 0.8; // seconds from when damage is done to when bite can start again

const BITE_TRIGGER_RANGE = 0.5; // distance from mouth for shark to bite
const BITE_DAMAGE_RANGE = 0.5; // distance from mouth for bite to do damage

const AGGRO_RANGE = 10; // meters
const UNAGGRO_RANGE = 15; // meters

const WIDTH = 3.0;
const HEIGHT = 0.6;

const AGGRO_SOUND = snd_ding;

export class Shark extends BaseEntity implements Entity {
  sprite: Sprite & GameSprite;
  body: Body;

  tags = ["shark"];

  patrolTexture = Texture.from(img_sharkPatrol);
  aggroTexture = Texture.from(img_sharkAggro);
  biteTexture = Texture.from(img_sharkBite);

  facingRight: boolean = rBool();

  constructor(position: V2d) {
    super();

    this.body = new Body({
      mass: 1,
      fixedRotation: true,
      collisionResponse: false,
      angle: 0,
    });
    this.body.addShape(
      new Capsule({
        length: WIDTH,
        radius: HEIGHT,
        collisionMask: CollisionGroups.All,
      })
    );
    this.body.position = position;

    this.sprite = new Sprite(this.patrolTexture);
    this.sprite.scale.set(WIDTH / this.sprite.texture.width);
    this.sprite.anchor.set(0.5);
    this.sprite.position.set(...position);
  }

  async onAdd() {
    this.patrol();
  }

  // Mode where we go back and forth
  async patrol(goingRight: boolean = true) {
    this.clearTimers("followDiver");
    this.clearTimers("patrol");

    this.sprite.texture = this.patrolTexture;

    await this.wait(
      PATROL_TIME,
      () => {
        this.swim(V(goingRight ? 1 : -1, 0), PATROL_SPEED);

        if (this.getDiverDistanceToMouth() < AGGRO_RANGE) {
          this.clearTimers("patrol");
          this.followDiver();
          this.game!.addEntity(new SoundInstance(AGGRO_SOUND, { gain: 0.1 }));
        }
      },
      "patrol"
    );

    this.patrol(!goingRight);
  }

  // Mode where we follow diver
  async followDiver() {
    this.clearTimers("followDiver");
    this.clearTimers("patrol");

    this.sprite.texture = this.aggroTexture;

    await this.wait(
      Infinity,
      () => {
        const diver = this.game?.entities.getById("diver") as Diver;

        if (!diver) {
          this.patrol();
          return;
        }

        const direction = diver.getPosition().isub(this.getMouthPosition());
        const distance = direction.magnitude;

        if (distance > UNAGGRO_RANGE) {
          this.patrol();
          return;
        }

        this.swim(direction.inormalize(), AGGRO_SPEED);

        if (distance < BITE_TRIGGER_RANGE) {
          this.bite(diver);
        }
      },
      "followDiver"
    );
  }

  // Mode where we're biting
  async bite(diver: Diver) {
    console.log("bite");
    this.clearTimers("followDiver");
    this.clearTimers("patrol");

    this.sprite.texture = this.biteTexture;

    await this.wait(WINDUP_TIME);

    // TODO: Get distance to diver's body, not just center
    if (this.getDiverDistanceToMouth() < BITE_DAMAGE_RANGE) {
      this.game?.addEntity(new SoundInstance(snd_sharkbite));
      diver.damage(50);
    } else {
      this.game?.addEntity(new SoundInstance(snd_sharkMiss));
    }
    await this.wait(COOLDOWN_TIME);

    this.sprite.texture = this.aggroTexture;

    this.followDiver();
  }

  getDiverPos(): V2d {
    const diver = this.game?.entities.getById("diver") as Diver;

    if (diver) {
      return diver.getPosition();
    } else {
      return V(0, 0);
    }
  }

  getMouthPosition(): V2d {
    const headX = this.facingRight ? WIDTH * 0.45 : WIDTH * -0.45;
    return this.localToWorld(V(headX, 0));
  }

  getDiverDistanceToMouth(): number {
    const diver = this.game?.entities.getById("diver") as Diver;
    if (!diver) {
      return Infinity;
    } else {
      return diver.getPosition().isub(this.getMouthPosition()).magnitude;
    }
  }

  swim(direction: V2d, speed = PATROL_SPEED) {
    this.sprite.scale.set(WIDTH / this.sprite.texture.width);
    this.facingRight = direction[0] > 0;
    this.body.applyForce(direction.mul(speed));
  }

  onTick(dt: number) {
    this.body.applyForce(V(this.body.velocity).imul(-FRICTION));

    // gravity when above water
    if (this.body.position[1] < 0) {
      this.body.applyForce([0, 9.8 * this.body.mass]);
    }
  }

  onRender(dt: number) {
    this.sprite.position.set(...this.body!.position);

    const scale = WIDTH / this.sprite.texture.width;
    if (this.facingRight) {
      this.sprite.scale.set(-scale, scale);
    } else {
      this.sprite.scale.set(scale, scale);
    }
  }
}
