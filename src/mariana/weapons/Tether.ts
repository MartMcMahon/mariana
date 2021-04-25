import { Body, DistanceConstraint, vec2 } from "p2";
import { Graphics } from "pixi.js";
import snd_reel from "../../../resources/audio/reel.flac";
import snd_reelInHarpoon from "../../../resources/audio/reel_in_harpoon.flac";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { SoundInstance } from "../../core/sound/SoundInstance";
import { V } from "../../core/Vector";
import { Diver } from "../Diver";

const TETHER_LENGTH = 10.0; // meters
const NUM_SEGMENTS = 25; // segments in the rope
const RETRACT_TIME = 1; // seconds

const SEGMENT_LENGTH = TETHER_LENGTH / (NUM_SEGMENTS + 1);

export class Tether extends BaseEntity implements Entity {
  sprite: Graphics;
  retracting = false;
  constraints: DistanceConstraint[];

  constructor(public diver: Diver, public harpoon: BaseEntity) {
    super();

    this.sprite = new Graphics();

    this.bodies = [];

    for (let i = 0; i < NUM_SEGMENTS; i++) {
      const body = new Body({
        mass: 0.002,
        position: diver.getPosition(),
        collisionResponse: false,
        fixedRotation: true,
      });
      // body.addShape(new Particle());
      this.bodies.push(body);
    }

    this.constraints = [];
    this.constraints.push(new DistanceConstraint(diver.body, this.bodies[0]));

    for (let i = 0; i < NUM_SEGMENTS - 1; i++) {
      const bodyA = this.bodies[i];
      const bodyB = this.bodies[i + 1];
      const constraint = new DistanceConstraint(bodyA, bodyB);
      this.constraints.push(constraint);
    }

    this.constraints.push(
      new DistanceConstraint(harpoon.body!, this.bodies[NUM_SEGMENTS - 1], {
        localAnchorA: V(-0.45, 0),
      })
    );

    for (const constraint of this.constraints) {
      constraint.lowerLimitEnabled = false;
      constraint.upperLimitEnabled = true;
      constraint.upperLimit = SEGMENT_LENGTH;
      constraint.setStiffness(10 ** 9);
      constraint.setRelaxation(2);
    }
  }

  async retract() {
    this.retracting = true;

    this.game!.addEntity(new SoundInstance(snd_reel, { gain: 0.05 }));

    const waitTime = RETRACT_TIME / NUM_SEGMENTS;
    for (let i = 0; i < this.constraints.length; i++) {
      await this.wait(waitTime, (dt, t) => {
        this.constraints[i].upperLimit = SEGMENT_LENGTH * (1.0 - t);
      });
    }

    await this.waitUntil(
      () =>
        this.harpoon.localToWorld(V(-0.45, 0)).isub(this.diver.getPosition())
          .magnitude < 0.3
    );
  }

  onTick() {
    for (const body of this.bodies!) {
      body.applyDamping(0.01);
      body.applyForce([0, body.mass * 9.8]);
    }
  }

  onRender() {
    this.sprite.clear();
    this.sprite.lineStyle(0.04, 0x000000, 0.95);
    const [diverX, diverY] = this.diver.getPosition();
    const [harpoonX, harpoonY] = this.harpoon.localToWorld(V(-0.45, 0));

    this.sprite.moveTo(diverX, diverY);

    for (const body of this.bodies!) {
      this.sprite.lineTo(body.position[0], body.position[1]);
    }

    this.sprite.lineTo(harpoonX, harpoonY);
  }
}
