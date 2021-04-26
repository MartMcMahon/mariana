import { Body, Circle } from "p2";
import { AnimatedSprite } from "pixi.js";
import img_jellyfish1 from "../../../resources/images/jellyfish_1.png";
import img_jellyfish2 from "../../../resources/images/jellyfish_2.png";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { rUniform } from "../../core/util/Random";
import { V2d } from "../../core/Vector";
import { CollisionGroups } from "../config/CollisionGroups";
import { Diver } from "../diver/Diver";
import { BaseFish } from "./BaseFish";

export class Jellyfish extends BaseFish {
  sprite: AnimatedSprite & GameSprite;

  constructor(position: V2d, radius: number = rUniform(0.4, 0.9)) {
    super(position, radius * 2, radius * 2);

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
  }

  onRender(dt: number) {
    this.sprite.update(dt);
  }

  onBeginContact(other: Entity) {
    if (other instanceof Diver) {
      other.damage(20);
    }
  }
}
