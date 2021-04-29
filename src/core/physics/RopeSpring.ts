import { LinearSpring, vec2 } from "p2";

var applyForce_r = vec2.create(),
  applyForce_r_unit = vec2.create(),
  applyForce_u = vec2.create(),
  applyForce_f = vec2.create(),
  applyForce_worldAnchorA = vec2.create(),
  applyForce_worldAnchorB = vec2.create(),
  applyForce_ri = vec2.create(),
  applyForce_rj = vec2.create(),
  applyForce_tmp = vec2.create();

/** Like a spring but only applies force when stretched not when compressed */
export default class RopeSpring extends LinearSpring {
  applyForce() {
    var k = this.stiffness,
      d = this.damping,
      l = this.restLength,
      bodyA = this.bodyA,
      bodyB = this.bodyB,
      r = applyForce_r,
      r_unit = applyForce_r_unit,
      u = applyForce_u,
      f = applyForce_f,
      tmp = applyForce_tmp;

    var worldAnchorA = applyForce_worldAnchorA,
      worldAnchorB = applyForce_worldAnchorB,
      ri = applyForce_ri,
      rj = applyForce_rj;

    // Get world anchors
    this.getWorldAnchorA(worldAnchorA);
    this.getWorldAnchorB(worldAnchorB);

    // Get offset points
    vec2.sub(ri, worldAnchorA, bodyA.position);
    vec2.sub(rj, worldAnchorB, bodyB.position);

    // Compute distance vector between world anchor points
    vec2.sub(r, worldAnchorB, worldAnchorA);
    var rlen = vec2.len(r);

    // Only apply force if we're beyond the length
    if (rlen > l) {
      vec2.normalize(r_unit, r);

      // Compute relative velocity of the anchor points, u
      vec2.sub(u, bodyB.velocity, bodyA.velocity);
      vec2.crossZV(tmp, bodyB.angularVelocity, rj);
      vec2.add(u, u, tmp);
      vec2.crossZV(tmp, bodyA.angularVelocity, ri);
      vec2.sub(u, u, tmp);

      // F = - k * ( x - L ) - D * ( u )
      vec2.scale(f, r_unit, -k * (rlen - l) - d * vec2.dot(u, r_unit));

      // Add forces to bodies
      vec2.sub(bodyA.force, bodyA.force, f);
      vec2.add(bodyB.force, bodyB.force, f);

      // Angular force
      var ri_x_f = vec2.crossLength(ri, f);
      var rj_x_f = vec2.crossLength(rj, f);
      bodyA.angularForce -= ri_x_f;
      bodyB.angularForce += rj_x_f;
    }
  }
}
