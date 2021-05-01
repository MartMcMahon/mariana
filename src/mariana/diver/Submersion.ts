import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { polarToVec } from "../../core/util/MathUtil";
import { rUniform } from "../../core/util/Random";
import { V } from "../../core/Vector";
import { SplashParticle } from "../effects/SurfaceSplash";
import { getWaves } from "../effects/Waves";
import { Diver } from "./Diver";

/** Keeps track of whether or not the diver is submerged */
export class Submersion extends BaseEntity implements Entity {
  wasAboveWater: boolean = false;

  constructor(public diver: Diver) {
    super();
  }

  onTick() {
    const diver = this.diver;
    const isAboveWater = diver.isSurfaced() ?? true;

    if (this.wasAboveWater != isAboveWater) {
      if (isAboveWater) {
        this.game?.dispatch({ type: "diverSubmerged", diver });
      } else {
        this.game?.dispatch({ type: "diverSurfaced", diver });
      }

      if (diver) {
        const diverPosition = diver.getPosition();
        const speed = Math.abs(diver.body.velocity[1]);
        const waves = getWaves(this.game!);
        for (let i = 0; i < 15 * Math.sqrt(speed); i++) {
          const x = rUniform(-0.3, 0.3) + diverPosition[0];
          const y = waves.getSurfaceHeight(x);
          const theta = waves.getSurfaceAngle(x);
          const velocity = polarToVec(
            rUniform(-Math.PI, Math.PI) + theta,
            rUniform(0.5, 1) * speed
          );
          this.game!.addEntity(new SplashParticle(V(x, y), velocity));
        }
      }
    }

    this.wasAboveWater = isAboveWater;
  }
}
