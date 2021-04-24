import {
  World,
  Body,
  vec2,
  OverlapKeeper,
  Narrowphase,
  Shape,
  ContactMaterial,
  Utils,
  RaycastResult,
  Ray,
  WorldOptions,
  AABB,
} from "p2";
import { ContactInfo } from "../ContactList";
import SpatialHashingBroadphase from "./SpatialHashingBroadphase";
import CustomNarrowphase from "./CustomNarrowphase";
import CustomSolver from "./CustomSolver";

interface WorldPrivate extends World {
  internalStep: (dt: number) => void;
  has: (type: string, listener?: Function) => boolean;
  bodiesToBeRemoved: Body[];
  runNarrowphase: (
    np: Narrowphase,
    bi: Body,
    si: Shape,
    xi: [number, number],
    ai: number,
    bj: Body,
    sj: Shape,
    xj: [number, number],
    aj: number,
    cm: ContactMaterial,
    glen: number
  ) => void;
}

// Reduce allocations
const step_mg = vec2.create();
const endOverlaps: ContactInfo[] = [];

interface PrivateOverlapKeeper extends OverlapKeeper {
  getEndOverlaps: (infos: ContactInfo[]) => void;
}

export default class CustomWorld extends World {
  // Adding types that are missing
  broadphase!: SpatialHashingBroadphase;
  solver!: CustomSolver;
  overlapKeeper!: PrivateOverlapKeeper;
  disabledBodyCollisionPairs!: Body[];

  // Actual stuff that we're keeping track of now
  dynamicBodies = new Set<Body>();
  kinematicBodies = new Set<Body>();

  constructor(options: WorldOptions) {
    super({
      broadphase: new SpatialHashingBroadphase(),
      islandSplit: false,
      solver: new CustomSolver(),
      ...options,
    });
    this.solver.setWorld(this);
    this.applyGravity = false;
    this.applyDamping = false;
    this.narrowphase = new CustomNarrowphase();
  }

  addBody(body: Body) {
    super.addBody.call(this, body);

    if (body.type === Body.DYNAMIC) {
      this.dynamicBodies.add(body);
    } else if (body.type === Body.KINEMATIC) {
      this.kinematicBodies.add(body);
    }
  }

  removeBody(body: Body) {
    super.removeBody.call(this, body);

    this.dynamicBodies.delete(body);
    this.kinematicBodies.delete(body);
  }

  raycast(result: RaycastResult, ray: Ray, shouldAddBodies: boolean = true) {
    // Get all bodies within the ray AABB
    // const bodies = this.broadphase.rayQuery(ray, shouldAddBodies);
    // ray.intersectBodies(result, bodies);
    // return result.hasHit();

    const aabb = new AABB();
    // @ts-ignore
    const bodies: Body = [];
    // @ts-ignore
    ray.getAABB(aabb);
    // @ts-ignore
    this.broadphase.aabbQuery(this, aabb, bodies, shouldAddBodies);
    // @ts-ignore
    ray.intersectBodies(result, bodies);

    return result.hasHit();
  }

  internalStep(dt: number) {
    this.stepping = true;

    this.overlapKeeper.tick();

    this.lastTimeStep = dt;

    this.stepPreCollision(dt);
    const broadphaseResult = this.stepBroadphase();
    this.stepNarrowphase(broadphaseResult);
    this.stepWakeup();
    this.stepContactEvents();
    this.stepConstraints(dt);
    this.stepIntegrate(dt);
    this.stepImpactEvents();
    this.stepSleep(dt);

    this.stepping = false;

    this.stepCleanup();

    this.emit(this.postStepEvent);
  }
  //#region internalStep
  stepPreCollision(dt: number) {
    const g = this.gravity;
    const mg = step_mg;

    // Update approximate friction gravity.
    if (this.useWorldGravityAsFrictionGravity) {
      const gravityLen = vec2.length(this.gravity);
      if (!(gravityLen === 0 && this.useFrictionGravityOnZeroGravity)) {
        // Nonzero gravity. Use it.
        this.frictionGravity = gravityLen;
      }
    }

    // Add gravity to bodies
    if (this.applyGravity) {
      for (const body of this.dynamicBodies) {
        if (body.sleepState !== Body.SLEEPING) {
          vec2.scale(mg, g, body.mass * body.gravityScale);
          vec2.add(body.force, body.force, mg);
        }
      }
    }

    // Add spring forces
    if (this.applySpringForces) {
      for (const s of this.springs) {
        s.applyForce();
      }
    }

    // Add damping
    if (this.applyDamping) {
      for (const body of this.dynamicBodies) {
        body.applyDamping(dt);
      }
    }
  }

  stepBroadphase() {
    // Broadphase
    var result = this.broadphase.getCollisionPairs(this);

    // Remove ignored collision pairs
    var ignoredPairs = this.disabledBodyCollisionPairs;
    for (var i = ignoredPairs.length - 2; i >= 0; i -= 2) {
      for (var j = result.length - 2; j >= 0; j -= 2) {
        if (
          (ignoredPairs[i] === result[j] &&
            ignoredPairs[i + 1] === result[j + 1]) ||
          (ignoredPairs[i + 1] === result[j] &&
            ignoredPairs[i] === result[j + 1])
        ) {
          result.splice(j, 2);
        }
      }
    }

    // Remove constrained pairs with collideConnected == false
    var Nconstraints = this.constraints.length;
    for (i = 0; i !== Nconstraints; i++) {
      var c = this.constraints[i];
      if (!c.collideConnected) {
        for (var j = result.length - 2; j >= 0; j -= 2) {
          if (
            (c.bodyA === result[j] && c.bodyB === result[j + 1]) ||
            (c.bodyB === result[j] && c.bodyA === result[j + 1])
          ) {
            result.splice(j, 2);
          }
        }
      }
    }

    // postBroadphase event
    this.postBroadphaseEvent.pairs = result;
    this.emit(this.postBroadphaseEvent);
    this.postBroadphaseEvent.pairs = [];

    return result;
  }

  stepNarrowphase(broadphaseResult: Body[]) {
    const np = this.narrowphase;

    // Narrowphase
    np.reset();
    for (
      var i = 0, Nresults = broadphaseResult.length;
      i !== Nresults;
      i += 2
    ) {
      var bi = broadphaseResult[i],
        bj = broadphaseResult[i + 1];

      // Loop over all shapes of body i
      for (var k = 0, Nshapesi = bi.shapes.length; k !== Nshapesi; k++) {
        var si = bi.shapes[k],
          xi = si.position,
          ai = si.angle;

        // All shapes of body j
        for (var l = 0, Nshapesj = bj.shapes.length; l !== Nshapesj; l++) {
          var sj = bj.shapes[l],
            xj = sj.position,
            aj = sj.angle;

          var cm = this.defaultContactMaterial;
          if (si.material && sj.material) {
            var tmp = this.getContactMaterial(si.material, sj.material);
            if (tmp) {
              cm = tmp;
            }
          }

          ((this as unknown) as WorldPrivate).runNarrowphase(
            np,
            bi,
            si,
            xi,
            ai,
            bj,
            sj,
            xj,
            aj,
            cm,
            this.frictionGravity
          );
        }
      }
    }
  }

  stepWakeup() {
    // Wake up bodies
    for (const body of this.dynamicBodies) {
      if ((body as any)._wakeUpAfterNarrowphase) {
        body.wakeUp();
        (body as any)._wakeUpAfterNarrowphase = false;
      }
    }
  }

  stepContactEvents() {
    const np = this.narrowphase;

    // Emit end overlap events
    if (this.has("endContact", undefined as any)) {
      this.overlapKeeper.getEndOverlaps(endOverlaps);
      const e = this.endContactEvent;
      let i = endOverlaps.length;
      while (i--) {
        var data = endOverlaps[i];
        e.shapeA = data.shapeA;
        e.shapeB = data.shapeB;
        e.bodyA = data.bodyA;
        e.bodyB = data.bodyB;
        this.emit(e);
      }
      endOverlaps.length = 0;
    }

    var preSolveEvent = this.preSolveEvent;
    preSolveEvent.contactEquations = np.contactEquations;
    preSolveEvent.frictionEquations = np.frictionEquations;
    this.emit(preSolveEvent);
    preSolveEvent.contactEquations = preSolveEvent.frictionEquations = [];
  }

  stepConstraints(dt: number) {
    const solver = this.solver;
    const np = this.narrowphase;
    const islandManager = this.islandManager;

    // update constraint equations
    for (const constraint of this.constraints) {
      constraint.update();
    }

    if (
      np.contactEquations.length ||
      np.frictionEquations.length ||
      this.constraints.length
    ) {
      if (this.islandSplit) {
        // Split into islands
        islandManager.equations.length = 0;
        Utils.appendArray(islandManager.equations, np.contactEquations);
        Utils.appendArray(islandManager.equations, np.frictionEquations);
        for (const constraint of this.constraints) {
          Utils.appendArray(islandManager.equations, constraint.equations);
        }
        for (let i = 0; i < this.constraints.length; i++) {}
        islandManager.split(this);

        for (const island of islandManager.islands) {
          if (island.equations.length) {
            solver.solveIsland(dt, island);
          }
        }
      } else {
        // Add contact equations to solver
        solver.addEquations(np.contactEquations);
        solver.addEquations(np.frictionEquations);

        // Add user-defined constraint equations
        for (const constraint of this.constraints) {
          solver.addEquations(constraint.equations);
        }

        if (this.solveConstraints) {
          solver.solve(dt, this);
        }

        solver.removeAllEquations();
      }
    }
  }

  stepIntegrate(dt: number) {
    const bodies = this.bodies;
    const Nbodies = this.bodies.length;

    // Step forward
    for (const body of this.kinematicBodies) {
      body.integrate(dt);
      body.setZeroForce();
    }

    for (const body of this.dynamicBodies) {
      body.integrate(dt);
      body.setZeroForce();
    }
  }

  stepImpactEvents() {
    const np = this.narrowphase;

    // Emit impact event
    if (
      this.emitImpactEvent &&
      ((this as unknown) as WorldPrivate).has("impact")
    ) {
      var ev = this.impactEvent;
      for (var i = 0; i !== np.contactEquations.length; i++) {
        var eq = np.contactEquations[i];
        if (eq.firstImpact) {
          ev.bodyA = eq.bodyA;
          ev.bodyB = eq.bodyB;
          ev.shapeA = eq.shapeA;
          ev.shapeB = eq.shapeB;
          ev.contactEquation = eq;
          this.emit(ev);
        }
      }
    }
  }

  stepSleep(dt: number) {
    const bodies = this.bodies;
    const Nbodies = bodies.length;
    // Sleeping update
    if (this.sleepMode === World.BODY_SLEEPING) {
      for (i = 0; i !== Nbodies; i++) {
        bodies[i].sleepTick(this.time, false, dt);
      }
    } else if (this.sleepMode === World.ISLAND_SLEEPING && this.islandSplit) {
      // Tell all bodies to sleep tick but dont sleep yet
      for (i = 0; i !== Nbodies; i++) {
        bodies[i].sleepTick(this.time, true, dt);
      }

      // Sleep islands
      for (var i = 0; i < this.islandManager.islands.length; i++) {
        var island = this.islandManager.islands[i];
        if (island.wantsToSleep()) {
          island.sleep();
        }
      }
    }
  }

  stepCleanup() {
    // Remove bodies that are scheduled for removal
    var bodiesToBeRemoved = ((this as unknown) as WorldPrivate)
      .bodiesToBeRemoved;
    for (var i = 0; i !== bodiesToBeRemoved.length; i++) {
      this.removeBody(bodiesToBeRemoved[i]);
    }
    bodiesToBeRemoved.length = 0;
  }
  //#endregion internalStep
}
