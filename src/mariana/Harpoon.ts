import { Body, Box, vec2 } from "p2";
import { Sprite } from "pixi.js";
import img_harpoon from "../../resources/images/harpoon.png";
import BaseEntity from "../core/entity/BaseEntity";
import Entity, { GameSprite } from "../core/entity/Entity";
import { V, V2d } from "../core/Vector";
import { Jellyfish } from "./enemies/Jellyfish";
import { PufferFish } from "./enemies/PufferFish";

const SIZE = 2.0; // Length in meters
const MAX_LIFE = 5; // seconds before it disappears

export class Harpoon extends BaseEntity implements Entity {
  body: Body;
  sprite: Sprite & GameSprite;

  constructor(public position: V2d, public velocity: V2d) {
    super();

    const sprite = (this.sprite = Sprite.from(img_harpoon));
    sprite.width = SIZE;
    sprite.height = SIZE;
    sprite.rotation = velocity.angle;
    sprite.anchor.set(0.5);

    this.body = new Body({
      mass: 0.1,
      collisionResponse: false,
      fixedRotation: true,
      position,
    });
    this.body.addShape(new Box({ width: SIZE, height: 0.2 }));
    this.body.velocity = velocity;
    this.body.angle = velocity.angle;
  }

  onAdd() {
    this.wait(MAX_LIFE).then(() => this.destroy());
  }

  onTick() {
    this.body.angle = V(this.body.velocity).angle;
  }

  onRender() {
    this.sprite.position.set(...this.body!.position);
    this.sprite.rotation = this.body.angle - Math.PI / 4;
    this.body;
  }

  onBeginContact(other: Entity) {
    if (other instanceof Jellyfish || other instanceof PufferFish) {
      other.destroy();
      this.destroy();
    }
  }
}
