import { Body, Circle } from "p2";
import { AnimatedSprite } from "pixi.js";
import snd_electrocution from "../../../resources/audio/fish/electrocution.flac";
import img_jellyfish1 from "../../../resources/images/fish/jellyfish_1.png";
import img_jellyfish2 from "../../../resources/images/fish/jellyfish_2.png";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { SoundInstance } from "../../core/sound/SoundInstance";
import { lerp } from "../../core/util/MathUtil";
import { rUniform } from "../../core/util/Random";
import { V2d } from "../../core/Vector";
import { CollisionGroups } from "../config/CollisionGroups";
import { Diver } from "../diver/Diver";
import { PointLight } from "../lighting/PointLight";
import { BaseFish } from "./BaseFish";

export class Jellyfish extends BaseFish {
  sprite: AnimatedSprite & GameSprite;
  light: PointLight;

  t = Math.random();

  constructor(position: V2d, radius: number = rUniform(0.3, 0.7)) {
    super(position, {
      width: radius * 2,
      height: radius * 2,
      speed: 0,
      friction: 0,
      hp: 5,
      dropValue: 3,
    });

    this.body = new Body({
      mass: 0,
      collisionResponse: false,
    });
    this.body.addShape(
      new Circle({ radius, collisionMask: CollisionGroups.All })
    );
    this.body.position = position;

    this.sprite = AnimatedSprite.fromImages([img_jellyfish1, img_jellyfish2]);
    this.sprite.animationSpeed = rUniform(0.9, 1.2);
    this.sprite.autoUpdate = false;
    this.sprite.width = radius * 2;
    this.sprite.height = radius * 2;
    this.sprite.anchor.set(0.5);
    this.sprite.loop = true;
    this.sprite.position.set(...position);

    this.sprite.update(Math.random() * 1.0);

    this.light = this.addChild(
      new PointLight({
        position,
        size: 3,
        intensity: 0.5,
        color: 0xff55bb,
      })
    );
  }

  onRender(dt: number) {
    this.t += dt;
    this.sprite.update(dt);
  }

  async onBeginContact(other: Entity) {
    if (other instanceof Diver) {
      other.damage(20);
      this.game!.addEntity(new SoundInstance(snd_electrocution, {}));

      this.light.intensity = 0.8;
      this.light.size = 5;
      await this.wait(0.5, (dt, t) => {
        this.light.intensity = lerp(0.8, 0.5, t);
        this.light.size = lerp(5, 3, t);
      });
      this.light.size = 3;
      this.light.intensity = 0.5;
    }
  }
}
