import { Matrix, Point } from "pixi.js";
import BaseEntity from "../entity/BaseEntity";
import Entity from "../entity/Entity";
import { lerpOrSnap } from "../util/MathUtil";
import { GameRenderer2d } from "./GameRenderer2d";
import { LayerInfo } from "./LayerInfo";
import { V2d, V } from "../Vector";

//  Controls the viewport.
export class Camera2d extends BaseEntity implements Entity {
  tags = ["camera"];
  persistenceLevel = 100;

  renderer: GameRenderer2d;
  position: V2d;
  z: number;
  angle: number;
  velocity: V2d;

  paralaxScale = 0.1;

  constructor(
    renderer: GameRenderer2d,
    position: V2d = V([0, 0]),
    z = 25.0,
    angle = 0
  ) {
    super();
    this.renderer = renderer;
    this.position = position;
    this.z = z;
    this.angle = angle;
    this.velocity = V([0, 0]);
  }

  get x() {
    return this.position[0];
  }

  set x(value) {
    this.position[0] = value;
  }

  get y() {
    return this.position[1];
  }

  set y(value) {
    this.position[1] = value;
  }

  get vx() {
    return this.velocity[0];
  }

  set vx(value) {
    this.velocity[0] = value;
  }

  get vy() {
    return this.velocity[1];
  }

  set vy(value) {
    this.velocity[1] = value;
  }

  getPosition() {
    return this.position;
  }

  onTick(dt: number) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }

  // Center the camera on a position
  center([x, y]: V2d) {
    this.x = x;
    this.y = y;
  }

  // Move the camera toward being centered on a position, with a target velocity
  smoothCenter([x, y]: V2d, [vx, vy]: V2d = V([0, 0]), smooth: number = 0.9) {
    const dx = (x - this.x) / this.game!.averageFrameDuration;
    const dy = (y - this.y) / this.game!.averageFrameDuration;
    this.smoothSetVelocity(V([vx + dx, vy + dy]), smooth);
  }

  smoothSetVelocity([vx, vy]: V2d, smooth: number = 0.9) {
    this.vx = lerpOrSnap(this.vx, vx, smooth);
    this.vy = lerpOrSnap(this.vy, vy, smooth);
  }

  // Move the camera part of the way to the desired zoom.
  smoothZoom(z: number, smooth: number = 0.9) {
    this.z = smooth * this.z + (1 - smooth) * z;
  }

  // Returns [width, height] of the viewport in pixels
  getViewportSize(): V2d {
    return V(
      this.renderer.pixiRenderer.width / this.renderer.pixiRenderer.resolution,
      this.renderer.pixiRenderer.height / this.renderer.pixiRenderer.resolution
    );
  }

  getWorldViewport(): {
    top: number;
    bottom: number;
    left: number;
    right: number;
    width: number;
    height: number;
  } {
    const [top, left] = this.toWorld(V(0, 0));
    const [bottom, right] = this.toWorld(this.getViewportSize());
    const width = right - left;
    const height = bottom - top;
    return { top, bottom, left, right, width, height };
  }

  // Convert screen coordinates to world coordinates
  toWorld([x, y]: V2d, depth: number = 1.0): V2d {
    let p = new Point(x, y);
    p = this.getMatrix(depth).applyInverse(p, p);
    return V(p.x, p.y);
  }

  // Convert world coordinates to screen coordinates
  toScreen([x, y]: V2d, depth = 1.0): V2d {
    let p = new Point(x, y);
    p = this.getMatrix(depth).apply(p, p);
    return V(p.x, p.y);
  }

  // Creates a transformation matrix to go from screen world space to screen space.
  getMatrix(depth: number = 1.0, [ax, ay]: V2d = V(0, 0)): Matrix {
    const [w, h] = this.getViewportSize();
    const { x: cx, y: cy, z, angle } = this;
    const scale = z * depth;

    return (
      new Matrix()
        // align the anchor with the camera
        .translate(ax * depth, ay * depth)
        .translate(-cx * depth, -cy * depth)
        // do all the scaling and rotating
        .scale(scale, scale)
        .rotate(angle)
        // put it back
        .translate(-ax * scale, -ay * scale)
        // Put it on the center of the screen
        .translate(w / 2.0, h / 2.0)
    );
  }

  paralaxToDepth(paralax: number): number {
    return (paralax - 1.0) * this.paralaxScale * this.z + 1.0;
  }

  // Update the properties of a renderer layer to match this camera
  updateLayer(layer: LayerInfo) {
    const container = layer.container;
    if (layer.paralax !== 0) {
      const depth = this.paralaxToDepth(layer.paralax);
      if (depth !== 0) {
        container.transform.setFromMatrix(this.getMatrix(depth, layer.anchor));
      }
    }
  }
}
