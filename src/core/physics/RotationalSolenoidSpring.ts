import { RotationalSpring } from "p2";

export default class RotationalSolenoidSpring extends RotationalSpring {
  applyForce() {
    const k = this.stiffness * 1000;
    const d = this.damping * 100;
    const l = this.restAngle;
    const bodyA = this.bodyA;
    const bodyB = this.bodyB;
    const x = bodyB.angle - bodyA.angle;
    const u = bodyB.angularVelocity - bodyA.angularVelocity;

    var torque = -k * (x - l) - d * u;

    torque = Math.sign(torque) * Math.abs(torque) ** 0.6 * 100;

    bodyA.angularForce -= torque;
    bodyB.angularForce += torque;
  }
}
