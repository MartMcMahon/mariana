import { Body, Box } from "p2";
import { Sprite } from "pixi.js";
import img_harpoon from "../../../resources/images/harpoon.png";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { SoundInstance } from "../../core/sound/SoundInstance";
import { V2d } from "../../core/Vector";
import { Jellyfish } from "../enemies/Jellyfish";
import { PufferFish } from "../enemies/PufferFish";
import { isHarpoonable } from "./Harpoonable";
import { SIZE, SOUND_RING, DAMPING } from "./HarpoonGun";

export class Harpoon extends BaseEntity implements Entity {
  body: Body;
  sprite: Sprite & GameSprite;

  constructor(public position: V2d, public velocity: V2d) {
    super();

    const sprite = (this.sprite = Sprite.from(img_harpoon));
    sprite.width = SIZE;
    sprite.height = SIZE;
    sprite.rotation = velocity.angle;
    sprite.anchor.set(0.5);

    this.body = new Body({
      mass: 0.03,
      collisionResponse: false,
      position,
    });
    this.body.addShape(new Box({ width: SIZE, height: 0.2 }));
    this.body.velocity = velocity;
    this.body.angle = velocity.angle;
    this.body.angularDamping = 0.12;
  }

  onTick() {
    // gravity
    this.body.applyForce([0, 9.8 * this.body.mass]);
    this.body.applyDamping(DAMPING);
  }

  onRender() {
    this.sprite.position.set(...this.body!.position);
    this.sprite.rotation = this.body.angle - Math.PI / 4;
  }

  onBeginContact(other: Entity) {
    if (isHarpoonable(other)) {
      other.onHarpooned(this);
      console.log("harpooning");
    }
  }
}
