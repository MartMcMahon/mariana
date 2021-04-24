import { Body, Box, Circle } from "p2";
import { Graphics } from "pixi.js";
import BaseEntity from "../core/entity/BaseEntity";
import Entity from "../core/entity/Entity";
import Game from "../core/Game";

export class Obstacle extends BaseEntity implements Entity {
  sprite: Graphics;
  body: Body;

  constructor(x: number, y: number, width: number, height: number) {
    super();

    this.body = new Body({ mass: 10, position: [x, y] });
    const shape = new Box({ width, height });
    this.body.addShape(shape);

    this.sprite = new Graphics();
    this.sprite.beginFill(0xff0000);
    this.sprite.drawRect(-width / 2, -height / 2, width, height);
    this.sprite.endFill();
  }

  onRender() {
    this.sprite.rotation = this.body.angle;
    this.sprite.x = this.body.position[0];
    this.sprite.y = this.body.position[1];
  }
}
