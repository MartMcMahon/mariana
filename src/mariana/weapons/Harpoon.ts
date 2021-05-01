import { Body, Box, ContactEquation, Shape, vec2 } from "p2";
import { Sprite } from "pixi.js";
import img_harpoon from "../../../resources/images/diver/harpoon.png";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { clamp, polarToVec } from "../../core/util/MathUtil";
import { rBool, rDirection, rNormal, rUniform } from "../../core/util/Random";
import { V, V2d } from "../../core/Vector";
import { CollisionGroups } from "../config/CollisionGroups";
import { Bubble } from "../effects/Bubble";
import { isHarpoonable } from "./Harpoonable";
import { DAMPING, SIZE } from "./HarpoonGun";

const MIN_SPEED_FOR_DAMAGE = 5; // meters/second

export class Harpoon extends BaseEntity implements Entity {
  body: Body;
  sprite: Sprite & GameSprite;

  minSpeed = Infinity;

  constructor(public position: V2d, public velocity: V2d) {
    super();

    const sprite = (this.sprite = Sprite.from(img_harpoon));
    sprite.width = SIZE;
    sprite.height = SIZE;
    sprite.rotation = velocity.angle;
    sprite.anchor.set(0.5);

    this.body = new Body({
      mass: 0.03,
      position,
    });
    this.body.addShape(
      new Box({
        width: SIZE,
        height: 0.2,
        collisionGroup: CollisionGroups.Harpoon,
        collisionMask: CollisionGroups.World | CollisionGroups.Fish,
      })
    );
    this.body.velocity = velocity;
    this.body.angle = velocity.angle;
    this.body.angularDamping = 0.12;
  }

  getVelocity(): V2d {
    return V(this.body.velocity);
  }

  onTick() {
    this.body.applyForce([0, 9.8 * this.body.mass]);
    if (this.body.position[1] > 0) {
      this.body.applyDamping(DAMPING);
    }

    this.minSpeed = Math.min(this.minSpeed, vec2.length(this.body.velocity));

    const bubbleChance = clamp((this.minSpeed / 40) ** 2);
    if (rBool(bubbleChance)) {
      this.game!.addEntity(
        new Bubble(
          this.getPosition().iadd(polarToVec(rDirection(), rUniform(0, 0.15))),
          V(rNormal(), rNormal()),
          rUniform(0.1, 0.2 + 0.2 * bubbleChance)
        )
      );
    }
  }

  onRender() {
    this.sprite.position.set(...this.body!.position);
    this.sprite.rotation = this.body.angle - Math.PI / 4;
  }

  onBeginContact(
    other: Entity,
    shapeA: Shape,
    shapeB: Shape,
    equations: ContactEquation[]
  ) {
    // harpoon other stuff
    if (isHarpoonable(other)) {
      other.onHarpooned(this);
    }
  }

  getDamageAmount(): number {
    if (this.minSpeed < MIN_SPEED_FOR_DAMAGE) {
      return 0;
    } else {
      return 10;
    }
  }
}
