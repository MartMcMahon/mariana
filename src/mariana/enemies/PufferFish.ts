import { Body, Particle } from "p2";
import { Sprite, Texture } from "pixi.js";
import snd_smallweapon1 from "../../../resources/audio/smallweapon1.flac";
import snd_smallweapon2 from "../../../resources/audio/smallweapon2.flac";
import snd_smallweapon3 from "../../../resources/audio/smallweapon3.flac";
import snd_smallweapon4 from "../../../resources/audio/smallweapon4.flac";
import img_puffer0 from "../../../resources/images/puffer0.png";
import img_puffer1 from "../../../resources/images/puffer1.png";
import img_puffer2 from "../../../resources/images/puffer2.png";
import img_puffer3 from "../../../resources/images/puffer3.png";
import img_puffer4 from "../../../resources/images/puffer4.png";
import img_spine from "../../../resources/images/spine.png";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { SoundInstance } from "../../core/sound/SoundInstance";
import { polarToVec } from "../../core/util/MathUtil";
import { rBool, rUniform, shuffle } from "../../core/util/Random";
import { V, V2d } from "../../core/Vector";
import { CollisionGroups } from "../config/CollisionGroups";
import { Diver, getDiver } from "../diver/Diver";
import { GroundTile } from "../region/GroundTile";
import { ShuffleRing } from "../utils/ShuffleRing";
import { BaseFish } from "./BaseFish";

const SPEED = 5;
const FRICTION = 2.0;
const PATROL_TIME = 5.0; // seconds travelled in each direction
const HP = 20;

const PUFF_TIME = 0.5; // duration of puff animation
const PUFF_COOLDOWN = 1.5; // duration after puff animation
const PUFF_TRIGGER_RANGE = 18;

const NUM_SPINES = 12;
const SPINE_SPEED = 10;
const SPINE_LIFESPAN = 5;
const SPINE_DELAY = 0.001; // seconds between spines
const SPINE_SIZE = 0.5;
const SPINE_DAMAGE = 25;

const SPINE_SOUNDS = new ShuffleRing([
  snd_smallweapon1,
  snd_smallweapon2,
  snd_smallweapon3,
  snd_smallweapon4,
]);

const ANGLES: number[] = [];
for (let i = 0; i < NUM_SPINES; i++) {
  ANGLES.push((2 * Math.PI * i) / NUM_SPINES);
}

export class PufferFish extends BaseFish {
  sprite: Sprite & GameSprite;

  movingRight = rBool();
  isPuffing: boolean = false;
  textures: Texture[];

  constructor(position: V2d, radius: number = rUniform(1.0, 1.5)) {
    super(position, {
      width: 2 * radius,
      height: 1.5 * radius,
      speed: SPEED,
      friction: FRICTION,
      hp: HP,
      dropValue: 20,
    });

    this.textures = [
      img_puffer0,
      img_puffer1,
      img_puffer2,
      img_puffer3,
      img_puffer4,
    ].map((img) => Texture.from(img));

    this.sprite = new Sprite(this.textures[0]);

    this.sprite.width = radius * 2;
    this.sprite.height = radius * 2;
    this.sprite.anchor.set(0.5);
    this.sprite.position.set(...position);

    if (this.movingRight) {
      this.sprite.scale.x *= -1;
    }
  }

  async onAdd() {
    await this.wait(Math.random() * PATROL_TIME);
    this.turnAround();
  }

  async turnAround() {
    this.sprite.scale.x *= -1;
    this.movingRight = !this.movingRight;

    await this.wait(PATROL_TIME);
    this.turnAround();
  }

  async puff() {
    this.isPuffing = true;
    await this.wait(
      PUFF_TIME,
      (dt, t) => {
        this.sprite.texture = this.textures[
          Math.floor(t * this.textures.length)
        ];
      },
      "puffing"
    );

    this.sprite.texture = this.textures[0];

    const angles = [...ANGLES];
    shuffle(angles);
    for (const angle of angles) {
      await this.wait(SPINE_DELAY);
      const direction = polarToVec(angle, 0.3);
      const position = direction.add(this.getPosition());
      this.game!.addEntity(new Spine(position, direction));
    }

    await this.wait(PUFF_COOLDOWN);
    this.isPuffing = false;
  }

  onTick(dt: number) {
    super.onTick(dt);

    const diver = getDiver(this.game)!;
    const distance = this.getPosition().isub(diver.getPosition()).magnitude;
    if (!this.isPuffing && distance < PUFF_TRIGGER_RANGE) {
      this.puff();
    }

    const direction = this.movingRight ? 1 : -1;
    this.swim(V(direction, 0));
  }

  onBeginContact(other: Entity) {
    if (other instanceof GroundTile) {
      this.turnAround();
    }
  }
}

class Spine extends BaseEntity implements Entity {
  sprite: Sprite & GameSprite;

  constructor(position: V2d, direction: V2d) {
    super();
    this.sprite = Sprite.from(img_spine);
    this.sprite.anchor.set(0.5);
    this.sprite.rotation = direction.angle;
    this.sprite.width = this.sprite.height = SPINE_SIZE;

    this.body = new Body({
      position,
      mass: 0.01,
      velocity: direction.normalize(SPINE_SPEED),
    });

    this.body.addShape(
      new Particle({
        collisionMask: CollisionGroups.World | CollisionGroups.Diver,
      })
    );
  }

  async onAdd() {
    this.game?.addEntity(
      new SoundInstance(SPINE_SOUNDS.getNext(), {
        gain: 0.1,
        speed: rUniform(-0.95, 1.05),
      })
    );
    await this.wait(SPINE_LIFESPAN);
    this.destroy();
  }

  onRender() {
    this.sprite.position.set(...this.body!.position);
  }

  onBeginContact(other: Entity) {
    if (other instanceof Diver) {
      other.damage(SPINE_DAMAGE);
      this.destroy();
    } else if (other instanceof GroundTile) {
      this.destroy();
    }
  }

  onTick(dt: number) {}
}
