// @ts-nocheck
import { Body, RaycastResult, Ray, vec2, BodyOptions } from "p2";

const result = new RaycastResult();
const ray = new Ray({
  from: [0, 0],
  to: [0, 0],
  mode: Ray.CLOSEST,
  skipBackfaces: true,
});
const end = vec2.create();
const startToEnd = vec2.create();
const rememberPosition = vec2.create();
const integrate_velodt = vec2.create();

export default class CCDBody extends Body {
  integrateToTimeOfImpact(dt: number) {
    if (
      this.ccdSpeedThreshold < 0 ||
      vec2.squaredLength(this.velocity) < Math.pow(this.ccdSpeedThreshold, 2)
    ) {
      return false;
    }

    vec2.scale(end, this.velocity, dt);
    vec2.add(end, end, this.position);

    vec2.sub(startToEnd, end, this.position);
    var startToEndAngle = this.angularVelocity * dt;
    var len = vec2.length(startToEnd);

    var timeOfImpact = 1;

    var hit;
    var that = this;
    result.reset();
    ray.callback = function (result) {
      if (result.body === that) {
        return;
      }
      hit = result.body;
      result.getHitPoint(end, ray);
      vec2.sub(startToEnd, end, that.position);
      timeOfImpact = vec2.length(startToEnd) / len;
      result.stop();
    };
    vec2.copy(ray.from, this.position);
    vec2.copy(ray.to, end);
    ray.collisionGroup = this.getCollisionGroup();
    ray.collisionMask = this.getCollisionMask();
    ray.update();
    this.world.raycast(result, ray);

    if (!hit) {
      return false;
    }

    var rememberAngle = this.angle;
    vec2.copy(rememberPosition, this.position);

    // Got a start and end point. Approximate time of impact using binary search
    var iter = 0;
    var tmin = 0;
    var tmid = 0;
    var tmax = timeOfImpact;
    while (tmax >= tmin && iter < this.ccdIterations) {
      iter++;

      // calculate the midpoint
      tmid = (tmax - tmin) / 2;

      // Move the body to that point
      vec2.scale(integrate_velodt, startToEnd, timeOfImpact);
      vec2.add(this.position, rememberPosition, integrate_velodt);
      this.angle = rememberAngle + startToEndAngle * timeOfImpact;
      this.updateAABB();

      // check overlap
      var overlaps =
        this.aabb.overlaps(hit.aabb) &&
        this.world.narrowphase.bodiesOverlap(this, hit);

      if (overlaps) {
        // change min to search upper interval
        tmin = tmid;
      } else {
        // change max to search lower interval
        tmax = tmid;
      }
    }

    timeOfImpact = tmid;

    vec2.copy(this.position, rememberPosition);
    this.angle = rememberAngle;

    // move to TOI
    vec2.scale(integrate_velodt, startToEnd, timeOfImpact);
    vec2.add(this.position, this.position, integrate_velodt);
    if (!this.fixedRotation) {
      this.angle += startToEndAngle * timeOfImpact;
    }

    return true;
  }

  private getCollisionMask() {
    let mask = 0;
    for (const shape of this.shapes) {
      mask |= shape.collisionMask;
    }
    return mask;
  }

  private getCollisionGroup() {
    let group = 0;
    for (const shape of this.shapes) {
      group |= shape.collisionGroup;
    }
    return group;
  }
}
