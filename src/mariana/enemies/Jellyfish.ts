import { Body, Circle } from "p2";
import { AnimatedSprite, Sprite, Texture } from "pixi.js";
import img_jellyfish from "../../../resources/images/jellyfish.png";
import img_jellyfish1 from "../../../resources/images/jellyfish_1.png";
import img_jellyfish2 from "../../../resources/images/jellyfish_2.png";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { rUniform } from "../../core/util/Random";
import { V2d } from "../../core/Vector";
import { Diver } from "../Diver";

export class Jellyfish extends BaseEntity implements Entity {
  sprite: AnimatedSprite & GameSprite;

  constructor(position: V2d, radius: number = rUniform(0.3, 0.9)) {
    super();

    this.body = new Body({ mass: 0, collisionResponse: false });
    this.body.addShape(new Circle({ radius }));
    this.body.position = position;

    this.sprite = new AnimatedSprite(
      [Texture.from(img_jellyfish1), Texture.from(img_jellyfish2)],
      false
    );
    this.sprite.width = radius * 2;
    this.sprite.height = radius * 2;
    this.sprite.anchor.set(0.5);
    this.sprite.loop = true;
    this.sprite.position.set(...position);
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
