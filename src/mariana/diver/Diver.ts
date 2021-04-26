import { Body, Capsule } from "p2";
import { Sprite } from "pixi.js";
import snd_dialogHelmetPain1 from "../../../resources/audio/dialog_helmet_pain1.flac";
import snd_dialogHelmetPain2 from "../../../resources/audio/dialog_helmet_pain2.flac";
import snd_dialogHelmetPain3 from "../../../resources/audio/dialog_helmet_pain3.flac";
import snd_dialogHelmetPain4 from "../../../resources/audio/dialog_helmet_pain4.flac";
import snd_dialogHelmetPain5 from "../../../resources/audio/dialog_helmet_pain5.flac";
import snd_dialogHelmetPain6 from "../../../resources/audio/dialog_helmet_pain6.flac";
import snd_dialogHelmetPain7 from "../../../resources/audio/dialog_helmet_pain7.flac";
import img_diver from "../../../resources/images/diver.png";
import img_diverLeft from "../../../resources/images/diver_left.png";
import img_diverRight from "../../../resources/images/diver_right.png";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import Game from "../../core/Game";
import { SoundInstance } from "../../core/sound/SoundInstance";
import { V, V2d } from "../../core/Vector";
import { Boat } from "../Boat";
import { CollisionGroups } from "../config/CollisionGroups";
import { ShuffleRing } from "../utils/ShuffleRing";
import { HarpoonGun } from "../weapons/HarpoonGun";
import { BreatheEffect } from "./Breathing";
import { Inventory } from "./Inventory";
import { HARPOON_OXYGEN_COST, OxygenManager } from "./OxygenManager";

const DIVER_HEIGHT = 2.0; // in meters
const DIVER_WIDTH = 0.65; // in meters
const DIVER_SPEED = 35.0; // Newtons?
const DIVER_DAMPING = 0.1; // Water friction
const DIVER_BUOYANCY = 1.5; //
const SURFACE_GRAVITY = 9.8; // meters / second

interface Sprites {
  forward: Sprite;
  left: Sprite;
  right: Sprite;
}

const HURT_SOUNDS = new ShuffleRing([
  snd_dialogHelmetPain1,
  snd_dialogHelmetPain2,
  snd_dialogHelmetPain3,
  snd_dialogHelmetPain4,
  snd_dialogHelmetPain5,
  snd_dialogHelmetPain6,
]);

export class Diver extends BaseEntity implements Entity {
  persistenceLevel = 1;
  sprite: Sprite;
  body: Body;
  // So we can easily grab the diver from other entities
  id = "diver";

  // Amount of health we have
  maxHp = 100;
  hp = this.maxHp;

  onBoat = true;

  subSprites: Sprites = {
    forward: Sprite.from(img_diver),
    left: Sprite.from(img_diverLeft),
    right: Sprite.from(img_diverRight),
  };

  harpoonGun: HarpoonGun;
  oxygenManager: OxygenManager;
  inventory: Inventory;

  aimDirection: V2d = V(0, 1);
  moveDirection: V2d = V(0, 0);

  constructor(position: V2d = V(0, 0)) {
    super();

    this.harpoonGun = this.addChild(new HarpoonGun(this));
    this.oxygenManager = this.addChild(new OxygenManager(this));
    this.inventory = this.addChild(new Inventory(this));
    this.addChild(new BreatheEffect(this));

    this.body = new Body({
      mass: 1,
      position: position.clone(),
      fixedRotation: true,
    });
    const shape = new Capsule({
      radius: DIVER_WIDTH / 2,
      length: DIVER_HEIGHT - DIVER_WIDTH,
      collisionGroup: CollisionGroups.Diver,
      collisionMask: CollisionGroups.All,
    });
    this.body.addShape(shape, [0, 0], Math.PI / 2);

    this.sprite = new Sprite();
    this.sprite.anchor.set(0.5);
    for (const subSprite of Object.values(this.subSprites) as Sprite[]) {
      subSprite.scale.set(DIVER_HEIGHT / subSprite.texture.height);
      subSprite.anchor.set(0.5);
      this.sprite.addChild(subSprite);
    }

    this.setSprite("forward");
  }

  setSprite(visibleSprite: keyof Sprites) {
    for (const [name, sprite] of Object.entries(this.subSprites)) {
      sprite.visible = name === visibleSprite;
    }
  }

  // Return the current depth in meters under the surface
  getDepth() {
    return this.body.position[1];
  }

  isSurfaced() {
    return this.getDepth() <= 0.4;
  }

  onRender() {
    this.sprite.x = this.body.position[0];
    this.sprite.y = this.body.position[1];

    const xMove = this.moveDirection[0];
    if (xMove > 0.1) {
      this.setSprite("right");
    } else if (xMove < -0.1) {
      this.setSprite("left");
    } else {
      this.setSprite("forward");
    }
  }

  onTick(dt: number) {
    if (this.onBoat) {
      const boat = this.game!.entities.getById("boat") as Boat;
      const [x, y] = boat.getLaunchPosition();
      this.body.position[0] = x;
      this.body.position[1] = y;
      this.body.velocity[0] = 0;
      this.body.velocity[1] = 0;
      this.body.collisionResponse = false;
    } else {
      if (!this.isSurfaced()) {
        if (this.hp > 0) {
          this.body.applyForce(this.moveDirection.mul(DIVER_SPEED));
        }

        this.body.applyDamping(DIVER_DAMPING);
        this.body.applyForce([
          0,
          (this.body.mass * SURFACE_GRAVITY) / DIVER_BUOYANCY,
        ]);
      } else {
        this.body.applyForce([0, this.body.mass * SURFACE_GRAVITY]);
      }
    }
  }

  jump() {
    if (this.onBoat) {
      this.onBoat = false;
      this.body.applyImpulse(V(1.6, -2));
      this.body.collisionResponse = true;
    }
  }

  damage(amount: number) {
    this.game?.addEntity(
      new SoundInstance(HURT_SOUNDS.getNext(), { gain: 0.5 })
    );
    this.hp -= amount;

    this.game?.dispatch({ type: "diverHurt", amount });

    if (this.hp <= 0) {
      this.game?.addEntity(
        new SoundInstance(snd_dialogHelmetPain7, { persistenceLevel: 1 })
      );
      this.game?.dispatch({ type: "diverDied" });
    }
  }

  shoot() {
    if (
      !this.onBoat &&
      this.oxygenManager.currentOxygen > HARPOON_OXYGEN_COST
    ) {
      this.harpoonGun.shoot(this.aimDirection);
    }
  }

  retract() {
    if (!this.onBoat) {
      this.harpoonGun.retract();
    }
  }
}

export function getDiver(game?: Game): Diver | undefined {
  return game?.entities.getById("diver") as Diver;
}
