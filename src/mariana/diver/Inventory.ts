import { AnimatedSprite, Sprite } from "pixi.js";
import snd_bellPositive2 from "../../../resources/audio/bell_positive_2.flac";
import img_pickup1 from "../../../resources/images/pickup-1.png";
import img_pickup2 from "../../../resources/images/pickup-2.png";
import img_pickup3 from "../../../resources/images/pickup-3.png";
import img_pickup4 from "../../../resources/images/pickup-4.png";
import img_pickup5 from "../../../resources/images/pickup-5.png";
import img_pickup6 from "../../../resources/images/pickup-6.png";
import img_pickup7 from "../../../resources/images/pickup-7.png";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { SoundInstance } from "../../core/sound/SoundInstance";
import { smoothStep } from "../../core/util/MathUtil";
import { rBool } from "../../core/util/Random";
import { V, V2d } from "../../core/Vector";
import { Boat } from "../Boat";
import { makeSoulDrops } from "../FishSoul";
import { Diver } from "./Diver";

export class Inventory extends BaseEntity implements Entity {
  fishSouls: number = 0;

  constructor(public diver: Diver) {
    super();
  }

  onTick(dt: number) {
    const boat = this.game!.entities.getById("boat") as Boat;

    if (boat.diverWithinDropoffRange() && this.fishSouls > 0 && rBool(0.2)) {
      let value = 1;
      if (this.fishSouls > 100) {
        value = 5;
      }
      if (this.fishSouls > 1000) {
        value = 50;
      }
      this.game?.addEntity(
        new FishSoulTransfer(this.diver.getPositwion(), value)
      );
      this.fishSouls -= value;
    }
  }

  handlers = {
    diverDied: () => {
      const center = this.diver.getPosition();
      makeSoulDrops(center, this.fishSouls);
      this.fishSouls = 0;
    },

    fishSoulCollected: ({ value }: { value: number }) => {
      this.fishSouls += value;
    },
  };
}

export class FishSoulTransfer extends BaseEntity implements Entity {
  persistenceLevel = 1; // so they stay even when the menu is opened
  velocity = V(0, 0);
  sprite: AnimatedSprite & GameSprite;

  constructor(public startPosition: V2d, public amount: number = 1) {
    super();

    this.sprite = AnimatedSprite.fromImages([
      img_pickup1,
      img_pickup2,
      img_pickup3,
      img_pickup4,
      img_pickup5,
      img_pickup6,
      img_pickup7,
    ]);

    this.sprite.anchor.set(0.5);
    this.sprite.width = this.sprite.height = 0.5 + Math.sqrt(amount) * 0.1;
    this.sprite.animationSpeed = 8;
  }

  async onAdd() {
    const boat = this.game?.entities.getById("boat") as Boat;
    await this.wait(1.0, (dt, t) => {
      const p = this.startPosition.lerp(
        boat.getDropoffPosition(),
        smoothStep(t ** 2)
      );
      this.sprite?.position.set(...p);
    });

    this.game?.dispatch({ type: "depositSouls", amount: 1 });
    this.game?.addEntity(new SoundInstance(snd_bellPositive2, { gain: 0.05 }));
    this.destroy();
  }

  onRender(dt: number) {
    this.sprite.update(dt);
  }
}
