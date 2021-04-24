import { Body, Circle } from "p2";
import { Sprite } from "pixi.js";
import img_jellyfish from "../../../resources/images/jellyfish.png";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { V2d } from "../../core/Vector";
import { Diver } from "../Diver";

export class Jellyfish extends BaseEntity implements Entity {
  constructor(position: V2d) {
    super();

    const sprite = (this.sprite = Sprite.from(img_jellyfish));
    sprite.position.set(position[0], position[1]);
    sprite.scale.set(0.6 / sprite.texture.width);

    this.body = new Body({ mass: 0, collisionResponse: false });
    this.body.addShape(new Circle({ radius: 0.3 }));
    this.body.position = position;
  }

  onBeginContact(other: Entity) {
    if (other instanceof Diver) {
      other.damage(20);
    }
  }
}
