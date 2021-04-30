import { Body, Capsule, vec2 } from "p2";
import { Sprite } from "pixi.js";
import snd_glowStickCrack1 from "../../../resources/audio/glow-stick-crack-1.flac";
import snd_glowStickDrop1 from "../../../resources/audio/glow-stick-drop-1.flac";
import snd_glowStickDrop2 from "../../../resources/audio/glow-stick-drop-2.flac";
import img_glowStick1 from "../../../resources/images/glow-stick-1.png";
import img_glowStick2 from "../../../resources/images/glow-stick-2.png";
import img_glowStick3 from "../../../resources/images/glow-stick-3.png";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { PositionalSound } from "../../core/sound/PositionalSound";
import { hslToHex } from "../../core/util/ColorUtils";
import { clamp } from "../../core/util/MathUtil";
import { choose, rNormal, rUniform } from "../../core/util/Random";
import { V2d } from "../../core/Vector";
import { CollisionGroups } from "../config/CollisionGroups";
import { Layer } from "../config/layers";
import { P2Materials } from "../config/PhysicsMaterials";
import { PointLight } from "../lighting/PointLight";

export const GLOWSTICK_TEXTURES = [
  img_glowStick1,
  img_glowStick2,
  img_glowStick3,
];

const DROP_SOUNDS = [snd_glowStickDrop1, snd_glowStickDrop2];
const CRACK_SOUNDS = [snd_glowStickCrack1];
export const GLOWSTICK_SOUNDS = [...DROP_SOUNDS, ...CRACK_SOUNDS];

const SIZE = [0.3, 0.08];
const SPRITE_LENGTH = 0.45;

const MIN_BOUNCE_SPEED = 1.0; // meters / second
const BOUNCE_RESTITUTION = 0.3; // percent of engergy retained in bounce

export default class GlowStick extends BaseEntity implements Entity {
  body: Body;
  light: PointLight;
  sprite: Sprite & GameSprite;
  z: number;
  zVelocity: number;

  constructor(position: V2d, velocity: V2d) {
    super();

    this.z = 1;
    this.zVelocity = rNormal(1, 0.4);

    this.body = new Body({
      mass: 0.1,
      position,
      velocity,
    });

    this.body.angularDamping = 1;
    this.body.damping = 1;
    this.body.angularVelocity = rUniform(5, 40);
    this.body.angle = rUniform(0, Math.PI * 2);

    const shape = new Capsule({
      radius: SIZE[1] / 2,
      length: SIZE[0],
      collisionGroup: CollisionGroups.World,
      collisionMask: CollisionGroups.World,
    });
    this.body.addShape(shape);

    const color = hslToHex({
      h: Math.random(),
      s: 1,
      l: 0.8,
    });
    this.light = this.addChild(
      new PointLight(position, { size: 10, color: color })
    );

    this.sprite = Sprite.from(choose(...GLOWSTICK_TEXTURES));
    this.sprite.tint = color;
    this.sprite.anchor.set(0.5);
    this.sprite.scale.set(SPRITE_LENGTH / this.sprite.texture.width);
    this.sprite.layerName = Layer.WORLD_FRONT;
  }

  onTick(dt: number) {
    if (this.z < 0) {
      this.z = 0;
      if (Math.abs(this.zVelocity) > MIN_BOUNCE_SPEED) {
        // bounce
        const gain = clamp(Math.abs(this.zVelocity) / 15) * 2;
        const sound = choose(...DROP_SOUNDS);
        const position = this.getPosition();
        this.game?.addEntity(new PositionalSound(sound, position, { gain }));

        this.zVelocity *= -BOUNCE_RESTITUTION;
        this.body.angularVelocity *= 0.5;
        this.body.velocity[0] *= 0.5;
        this.body.velocity[1] *= 0.5;
      } else {
        // on ground
        this.zVelocity = 0;
        this.turnToStatic();
      }
    } else {
      this.z += this.zVelocity * dt;
      this.zVelocity -= 9.8 * dt; // gravity
    }
  }

  onImpact() {
    const gain = clamp(vec2.length(this.body.velocity) / 5);
    const sound = choose(...DROP_SOUNDS);
    const position = this.getPosition();
    this.game?.addEntity(new PositionalSound(sound, position, { gain }));
  }

  afterPhysics() {
    this.light.setPosition(this.body.position);
    this.sprite.position.set(...this.body.position);
    this.sprite.rotation = this.body.angle;
  }

  onRender() {
    const scale = 1 + this.z * 0.8;
    this.sprite.scale.set((SPRITE_LENGTH / this.sprite.texture.width) * scale);
  }

  // Turn this into a static thing so we don't have any more on ticks or on renders or physics or whatnot
  turnToStatic() {
    const sprite = new Sprite();
    sprite.texture = this.sprite.texture;
    sprite.scale.copyFrom(this.sprite.scale);
    sprite.anchor.copyFrom(this.sprite.anchor);
    sprite.tint = this.sprite.tint;
    sprite.position.copyFrom(this.sprite.position);
    sprite.rotation = this.sprite.rotation;
    (sprite as GameSprite).layerName = this.sprite.layerName;

    this.game?.addEntity(new StaticGlowstick(sprite, this.light));

    this.destroy();
  }
}

// A cheaper, non-moving effect
class StaticGlowstick extends BaseEntity {
  constructor(public sprite: Sprite & GameSprite, public light: PointLight) {
    super();

    this.addChild(light, true); // steal it from the original
    this.sprite.layerName = Layer.WORLD_BACK;
  }

  async onAdd() {
    await this.wait(120);
    await this.wait(10, (dt, t) => {
      this.sprite.alpha = 1 - t;
      this.light.intensity = 1 - t;
    });
    this.destroy();
  }

  // TODO: Destroy only the oldest ones
}
