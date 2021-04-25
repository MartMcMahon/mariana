import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import img_tile from "../../../resources/images/tiles/stone_tiles2.png";
import {V, V2d} from "../../core/Vector";
import fs from 'fs';
import {BaseTexture, Rectangle, Sprite, Texture} from "pixi.js";
import {Body, Box, Circle} from "p2";
import * as data from "../../../resources/regions/regions.json";

const REGION_WIDTH = 36.5;
const REGION_SIZE = 16;
const TILE_SIZE = 64;
const TILE_SET_WIDTH = 3;

export class Region extends BaseEntity implements Entity {

    static tileset: Texture;

    static genRegions() {

        let regions = [];

        let pos = V(-REGION_WIDTH * 2,0);
        let rdata;

        for (let i = 0; i < 4; i++) {

            if (i == 0) {
                rdata = data.start;
            }

            regions.push(new Region(pos, rdata));

            pos.x += REGION_WIDTH;
        }

        return regions;
    }

    sprites: Sprite[] = [];
    data: any;

    constructor(position: V2d = V(0, 0), data: any) {
        super();

        this.data = data;
        this.bodies = [];

        if (Region.tileset == null) {
            Region.tileset = Texture.from(img_tile);

            Region.tileset.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        }

        let fs = require('fs');
        const file = fs.readFileSync("resources/regions/test.csv", 'utf8');

        let x = 0;
        let y = 0;
        file.split("\n").forEach((line:string) => {
            line.split(",").forEach((tileString:string) => {

                let i = parseInt(tileString);

                if (isNaN(i) || i == -1) {
                    x++;
                    return;
                }

                let texture = new Texture(
                    (Region.tileset as any) as BaseTexture,
                    new Rectangle(
                        (i % TILE_SET_WIDTH) * (TILE_SIZE + 1) + .25,
                        (Math.floor(i / TILE_SET_WIDTH)) * (TILE_SIZE + 1) + .25,
                        TILE_SIZE - .25, TILE_SIZE - .25)
                )

                texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

                let sprite = Sprite.from(texture);

                sprite.scale.set(0.0365);

                sprite.x = position.x + x * 2.3;
                sprite.y = position.y + y * 2.3;

                sprite.visible = true;
                sprite.anchor.set(0.5);

                this.sprites.push(sprite);

                let body = new Body({ mass: 0, position: V(sprite.x, sprite.y) });
                const shape = new Box({ width: 1.15, height: 1.15 });
                body.addShape(shape);

                this.bodies.push(body);

                x++;
            });

            x = 0;
            y++;
        });
    }
}