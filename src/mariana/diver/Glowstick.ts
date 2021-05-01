import { Body, Capsule, vec2 } from "p2";
import { Sprite } from "pixi.js";
import snd_glowStickCrack1 from "../../../resources/audio/diver/glow-stick-crack-1.flac";
import snd_glowStickDrop1 from "../../../resources/audio/impacts/glow-stick-drop-1.flac";
import snd_glowStickDrop2 from "../../../resources/audio/impacts/glow-stick-drop-2.flac";
import img_glowStick1 from "../../../resources/images/particles/glow-stick-1.png";
import img_glowStick2 from "../../../resources/images/particles/glow-stick-2.png";
import img_glowStick3 from "../../../resources/images/particles/glow-stick-3.png";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../core/entity/Entity";
import Game from "../../core/Game";
import { SoundInstance } from "../../core/sound/SoundInstance";
import { hslToHex } from "../../core/util/ColorUtils";
import { clamp } from "../../core/util/MathUtil";
import { choose, rUniform } from "../../core/util/Random";
import { V2d } from "../../core/Vector";
import { CollisionGroups } from "../config/CollisionGroups";
import { Layer } from "../config/layers";
import { PointLight } from "../lighting/PointLight";
import { ShuffleRing } from "../utils/ShuffleRing";

export const GLOWSTICK_TEXTURES = [
  img_glowStick1,
  img_glowStick2,
  img_glowStick3,
];

const DROP_SOUNDS = new ShuffleRing([snd_glowStickDrop1, snd_glowStickDrop2]);
const CRACK_SOUNDS = new ShuffleRing([snd_glowStickCrack1]);

const SIZE = [0.5, 0.1];
const SPRITE_LENGTH = 0.45;

export default class GlowStick extends BaseEntity implements Entity {
  body: Body;
  light: PointLight;
  sprite: Sprite & GameSprite;

  constructor(position: V2d, velocity: V2d) {
    super();

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
      new PointLight({ position, size: 10, color: color })
    );

    this.sprite = Sprite.from(choose(...GLOWSTICK_TEXTURES));
    this.sprite.tint = color;
    this.sprite.anchor.set(0.5);
    this.sprite.scale.set(SPRITE_LENGTH / this.sprite.texture.width);
    this.sprite.layerName = Layer.WORLD;
  }

  onAdd(game: Game) {
    game.addEntity(new SoundInstance(CRACK_SOUNDS.getNext()));
  }

  onTick(dt: number) {
    const submerged = this.body.position[1] < 0;
    const g = submerged ? 9.8 : 6;
    this.body.angularDamping = submerged ? 3.0 : 1.0;
    this.body.applyForce([0, 9.8 * this.body.mass]);

    if (vec2.length(this.body.velocity) < 0.01) {
      this.turnToStatic();
    }
  }

  onImpact() {
    const gain = clamp(vec2.length(this.body.velocity) / 5);
    const sound = DROP_SOUNDS.getNext();
    const position = this.getPosition();
    this.game?.addEntity(
      new SoundInstance(sound, { gain, speed: rUniform(0.9, 1.1) })
    );
  }

  onRender() {
    this.sprite.position.set(...this.body.position);
    this.sprite.rotation = this.body.angle;
    this.light.setPosition(this.body.position);
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
}
