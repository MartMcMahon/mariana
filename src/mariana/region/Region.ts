import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import img_diverLeft from "../../../resources/images/tiles/tile.png";
import {V, V2d} from "../../core/Vector";
import fs from 'fs';
import {Sprite} from "pixi.js";
import {Body, Box, Circle} from "p2";

const REGION_SIZE = 16;
const TILE_SIZE = 64;

export class Region extends BaseEntity implements Entity {

    sprites: Sprite[] = [];

    constructor(position: V2d = V(0, 0)) {
        super();

        this.bodies = [];

        var fs = require('fs');
        const file = fs.readFileSync("resources/regions/test.csv", 'utf8');

        let x = 0;
        let y = 0;
        file.split("\n").forEach((line:string) => {
            line.split(",").forEach((tileString:string) => {

                if (tileString == '0') {
                    let sprite = Sprite.from(img_diverLeft);

                    sprite.scale.set(0.03611);

                    sprite.x = position.x + x * 2.3;
                    sprite.y = position.y + y * 2.3;

                    sprite.visible = true;
                    sprite.anchor.set(0.5);

                    this.sprites.push(sprite);

                    let body = new Body({ mass: 0, position: V(sprite.x, sprite.y) });
                    const shape = new Box({ width: 1.15, height: 1.15 });
                    body.addShape(shape);

                    this.bodies.push(body);
                }

                x++;
            });

            x = 0;
            y++;
        });
    }
}