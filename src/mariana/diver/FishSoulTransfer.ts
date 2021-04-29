import { AnimatedSprite } from "pixi.js";
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
import { V, V2d } from "../../core/Vector";
import { Boat } from "../Boat";

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
