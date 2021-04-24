import {
  GSSolver,
  World,
  Equation,
  Body,
  ContactEquation,
  FrictionEquation,
} from "p2";
import CustomWorld from "./CustomWorld";

interface EquationExtended extends Equation {
  a: number;
  b: number;
  B: number;
  invC: number;
  lambda: number;
  maxForceDt: number;
  minForceDt: number;
  contactEquations: ContactEquation[];
  frictionCoefficient: number;
}

interface BodyExtended extends Body {
  addConstraintVelocity: () => void;
  resetConstraintVelocity: () => void;
}

export default class CustomSolver extends GSSolver {
  equations!: EquationExtended[];
  world!: CustomWorld;

  constructor() {
    super({ iterations: 1, tolerance: 0 });
  }

  setWorld(world: CustomWorld) {
    this.world = world;
  }

  prepareBodies() {
    for (const body of this.world.dynamicBodies) {
      body.updateSolveMassProperties();
    }
  }

  computeEquations(dt: number) {
    for (const eq of this.equations) {
      eq.lambda = 0;
      if (eq.timeStep !== dt || eq.needsUpdate) {
        eq.timeStep = dt;
        eq.update();
      }
      eq.B = eq.computeB(eq.a, eq.b, dt);
      eq.invC = eq.computeInvC(eq.epsilon);

      eq.maxForceDt = eq.maxForce * dt;
      eq.minForceDt = eq.minForce * dt;
    }
  }

  prepareBodies2() {
    for (const body of this.world.dynamicBodies) {
      (body as BodyExtended).resetConstraintVelocity();
    }
  }

  // Add result to velocity
  postBodies() {
    for (const body of this.world.dynamicBodies) {
      (body as BodyExtended).addConstraintVelocity();
    }
  }

  doFriction(dt: number) {
    const maxFrictionIter = this.frictionIterations;
    const equations = this.equations;
    const tolSquared = Math.pow(this.tolerance * this.equations.length, 2);

    if (maxFrictionIter) {
      // Iterate over contact equations to get normal forces
      for (let iter = 0; iter !== maxFrictionIter; iter++) {
        // Accumulate the total error for each iteration.
        let deltalambdaTot = 0.0;

        for (const c of equations) {
          var deltalambda = iterateEquation(c);
          deltalambdaTot += Math.abs(deltalambda);
        }

        this.usedIterations++;

        // If the total error is small enough - stop iterate
        if (deltalambdaTot * deltalambdaTot <= tolSquared) {
          break;
        }
      }

      this.postBodies();

      updateMultipliers(equations, 1 / dt);

      // Set computed friction force
      for (const eq of equations) {
        if (eq instanceof FrictionEquation) {
          var f = 0.0;
          for (var k = 0; k !== eq.contactEquations.length; k++) {
            f += eq.contactEquations[k].multiplier;
          }
          f *= eq.frictionCoefficient / eq.contactEquations.length;
          eq.maxForce = f;
          eq.minForce = -f;

          eq.maxForceDt = f * dt;
          eq.minForceDt = -f * dt;
        }
      }
    }
  }

  doIterations(dt: number) {
    const maxIter = this.iterations;
    const tolSquared = Math.pow(this.tolerance * this.equations.length, 2);

    for (let iter = 0; iter !== maxIter; iter++) {
      // Accumulate the total error for each iteration.
      let deltalambdaTot = 0.0;
      for (const c of this.equations) {
        var deltalambda = iterateEquation(c);
        deltalambdaTot += Math.abs(deltalambda);
      }

      this.usedIterations++;

      // If the total error is small enough - stop iterate
      if (deltalambdaTot * deltalambdaTot < tolSquared) {
        break;
      }
    }
  }

  solve(dt: number, world: World) {
    this.sortEquations();

    const equations = this.equations;
    const Neq = equations.length;

    this.usedIterations = 0;

    if (Neq !== 0) {
      this.prepareBodies();
      this.computeEquations(dt);
      this.prepareBodies2();
      this.doFriction(dt);
      this.doIterations(dt);
      this.postBodies();
      updateMultipliers(equations, 1 / dt);
    }
  }
}

// Sets the .multiplier property of each equation
function updateMultipliers(equations: EquationExtended[], invDt: number) {
  var l = equations.length;
  while (l--) {
    var eq = equations[l];
    eq.multiplier = eq.lambda * invDt;
  }
}

function iterateEquation(eq: EquationExtended) {
  // Compute iteration
  var B = eq.B,
    eps = eq.epsilon,
    invC = eq.invC,
    lambdaj = eq.lambda,
    GWlambda = eq.computeGWlambda(),
    maxForce_dt = eq.maxForceDt,
    minForce_dt = eq.minForceDt;

  var deltalambda = invC * (B - GWlambda - eps * lambdaj);

  // Clamp if we are not within the min/max interval
  var lambdaj_plus_deltalambda = lambdaj + deltalambda;
  if (lambdaj_plus_deltalambda < minForce_dt) {
    deltalambda = minForce_dt - lambdaj;
  } else if (lambdaj_plus_deltalambda > maxForce_dt) {
    deltalambda = maxForce_dt - lambdaj;
  }
  eq.lambda += deltalambda;
  eq.addToWlambda(deltalambda);

  return deltalambda;
}
