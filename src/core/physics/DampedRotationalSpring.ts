import { RotationalSpring } from "p2";

export default class DampedRotationalSpring extends RotationalSpring {
  applyForce() {
    const k = this.stiffness;
    const d = this.damping;
    const l = this.restAngle;
    const bodyA = this.bodyA;
    const bodyB = this.bodyB;
    const x = bodyB.angle - bodyA.angle;
    const u = bodyB.angularVelocity - bodyA.angularVelocity;

    var torque = -k * (x - l) - d * u;

    bodyA.angularForce -= torque;
    bodyB.angularForce += torque;
  }
}
