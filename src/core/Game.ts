import p2, { World } from "p2";
import ContactList, {
  ContactInfo,
  ContactInfoWithEquations,
} from "./ContactList";
import Entity, { WithOwner } from "./entity/Entity";
import EntityList from "./EntityList";
import { GameRenderer2d } from "./graphics/GameRenderer2d";
import { IOManager } from "./io/IO";
import CustomWorld from "./physics/CustomWorld";
import { lerp } from "./util/MathUtil";

interface GameOptions {
  audio?: AudioContext;
  tickIterations?: number;
  framerate?: number;
  world?: World | CustomWorld;
}

/**
 * Top Level control structure
 */
export default class Game {
  /** Keeps track of entities in lots of useful ways */
  entities: EntityList;
  /** Keeps track of entities that are ready to be removed */
  entitiesToRemove: Set<Entity>;

  renderer: GameRenderer2d;

  /** Manages keyboard/mouse/gamepad state and events. */
  io: IOManager;
  /** The top level container for physics. */
  world: p2.World;
  /** Keep track of currently occuring collisions */
  contactList: ContactList;
  /** A static physics body positioned at [0,0] with no shapes. Useful for constraints/springs */
  ground: p2.Body;
  /** The audio context that is connected to the output */
  audio: AudioContext;
  /** Volume control for all sound output by the game. */
  masterGain: GainNode;
  /** Readonly. Whether or not the game is paused */
  paused: boolean = false;
  /** Readonly. Number of frames that have gone by */
  framenumber: number = 0;
  /** Readonly. Number of ticks that have gone by */
  ticknumber: number = 0;
  /** The timestamp when the last frame started */
  lastFrameTime: number = window.performance.now();
  /** Number of ticks that happen per frame */
  tickIterations: number;

  /** Total amount of game time that has elapsed */
  elapsedTime: number = 0;

  averageFrameDuration = 1 / 60;

  get camera() {
    return this.renderer.camera;
  }

  private _slowMo: number = 1.0;
  /** Multiplier of time that passes during tick */
  get slowMo() {
    return this._slowMo;
  }

  set slowMo(value: number) {
    if (value != this._slowMo) {
      this._slowMo = value;
      this.dispatch({ type: "slowMoChanged", slowMo: this._slowMo });
    }
  }

  /**
   * Create a new Game.
   */
  constructor({
    audio,
    tickIterations = 5,
    framerate = 60,
    world,
  }: GameOptions) {
    this.entities = new EntityList();
    this.entitiesToRemove = new Set();

    this.renderer = new GameRenderer2d(this.onResize.bind(this));

    this.io = new IOManager(this.renderer.pixiRenderer.view);

    this.tickIterations = tickIterations;
    // this.world = new World({ gravity: [0, 0] });
    this.world = world ?? new CustomWorld({ gravity: [0, 0] });
    this.world.on("beginContact", this.beginContact, null);
    this.world.on("endContact", this.endContact, null);
    this.world.on("impact", this.impact, null);
    this.ground = new p2.Body({ mass: 0 });
    this.world.addBody(this.ground);
    this.contactList = new ContactList();

    this.audio = audio ?? new AudioContext();
    this.masterGain = this.audio.createGain();
    this.masterGain.connect(this.audio.destination);

    this.addEntity(this.renderer.camera);
  }

  /** Start the event loop for the game. */
  start(): void {
    window.requestAnimationFrame(() => this.loop(this.lastFrameTime));
  }

  /** See pause() and unpause(). */
  togglePause() {
    if (this.paused) {
      this.unpause();
    } else {
      this.pause();
    }
  }

  onResize(size: [number, number]) {
    for (const entity of this.entities.withOnResize) {
      entity.onResize(size);
    }
  }

  /**
   * Pauses the game. This stops physics from running, calls onPause()
   * handlers, and stops updating `pausable` entities.
   **/
  pause() {
    if (!this.paused) {
      this.paused = true;
      for (const entity of this.entities.withOnPause) {
        entity.onPause!();
      }
    }
  }

  /** Resumes the game and calls onUnpause() handlers. */
  unpause() {
    this.paused = false;
    for (const entity of this.entities.withOnUnpause) {
      entity.onUnpause!();
    }
  }

  /** Dispatch a custom event. */
  dispatch<T extends { type: string }>(event: T) {
    const type: string = event.type;
    for (const entity of this.entities.getHandlers(type)) {
      entity.handlers![type](event);
    }
  }

  /** Add an entity to the game. */
  addEntity = <T extends Entity>(entity: T): T => {
    entity.game = this;
    if (entity.onAdd) {
      entity.onAdd(this);
    }

    this.entities.add(entity);
    this.io.addHandler(entity);

    if (entity.body) {
      entity.body.owner = entity;
      this.world.addBody(entity.body);
    }
    if (entity.bodies) {
      for (const body of entity.bodies) {
        body.owner = entity;
        this.world.addBody(body);
      }
    }
    if (entity.springs) {
      for (const spring of entity.springs) {
        this.world.addSpring(spring);
      }
    }
    if (entity.constraints) {
      for (const constraint of entity.constraints) {
        this.world.addConstraint(constraint);
      }
    }

    if (entity.sprite) {
      this.renderer.addSprite(entity.sprite);
      entity.sprite.owner = entity;
    }
    if (entity.sprites) {
      for (const sprite of entity.sprites) {
        this.renderer.addSprite(sprite);
        sprite.owner = entity;
      }
    }

    if (entity.onResize) {
      entity.onResize(this.renderer.getSize());
    }

    if (entity.children) {
      for (const child of entity.children) {
        if (!child.game) {
          this.addEntity(child);
        }
      }
    }

    if (entity.afterAdded) {
      entity.afterAdded(this);
    }

    return entity;
  };

  /** Shortcut for adding multiple entities. */
  addEntities<T extends readonly Entity[]>(entities: T): T {
    for (const entity of entities) {
      this.addEntity(entity);
    }
    return entities;
  }

  /**
   * Remove an entity from the game.
   * The entity will actually be removed during the next removal pass.
   * This is because there are times when it's not safe to remove an entity, like in the middle of a physics step.
   */
  removeEntity(entity: Entity) {
    entity.game = undefined;
    if (this.world.stepping) {
      this.entitiesToRemove.add(entity);
    } else {
      this.cleanupEntity(entity);
    }
    return entity;
  }

  /** Remove all non-persistent entities. I think this is kinda sketchy. */
  clearScene(persistenceThreshold = 0) {
    for (const entity of this.entities) {
      if (
        entity.game && // Not already destroyed
        !this.entitiesToRemove.has(entity) && // not already about to be destroyed
        entity.persistenceLevel <= persistenceThreshold &&
        !entity.parent // We only wanna deal with top-level things, let parents handle the rest
      ) {
        entity.destroy();
      }
    }
  }

  private iterationsRemaining = 0.0;
  /** The main event loop. Run one frame of the game.  */
  private loop(time: number): void {
    window.requestAnimationFrame((t) => this.loop(t));
    this.framenumber += 1;

    const lastFrameDuration = (time - this.lastFrameTime) / 1000;
    this.lastFrameTime = time;

    // Keep a rolling average
    if (0 < lastFrameDuration && lastFrameDuration < 0.3) {
      // Ignore weird durations because they're probably flukes from the user
      // changing to a different tab/window or loading a new level or something
      this.averageFrameDuration = lerp(
        this.averageFrameDuration,
        lastFrameDuration,
        0.05
      );
    }

    const renderDt = this.averageFrameDuration;
    this.elapsedTime += renderDt;

    const tickDt = (renderDt / this.tickIterations) * this.slowMo;
    this.iterationsRemaining += this.tickIterations;
    for (; this.iterationsRemaining > 1.0; this.iterationsRemaining--) {
      this.tick(tickDt);
      if (!this.paused) {
        this.world.step(tickDt / 2);
        this.cleanupEntities();
        this.world.step(tickDt / 2);
        this.cleanupEntities();
        this.contacts();
      }
    }
    this.afterPhysics();

    this.render(renderDt);
  }

  /** Actually remove all the entities slated for removal from the game. */
  private cleanupEntities() {
    for (const entity of this.entitiesToRemove) {
      this.cleanupEntity(entity);
    }
    this.entitiesToRemove.clear();
  }

  private cleanupEntity(entity: Entity) {
    entity.game = undefined; // This should be done by `removeEntity`, but better safe than sorry
    this.entities.remove(entity);
    this.io.removeHandler(entity);

    if (entity.body) {
      this.world.removeBody(entity.body);
    }
    if (entity.bodies) {
      for (const body of entity.bodies) {
        this.world.removeBody(body);
      }
    }
    if (entity.springs) {
      for (const spring of entity.springs) {
        this.world.removeSpring(spring);
      }
    }
    if (entity.constraints) {
      for (const constraint of entity.constraints) {
        this.world.removeConstraint(constraint);
      }
    }

    if (entity.sprite) {
      this.renderer.removeSprite(entity.sprite);
    }
    if (entity.sprites) {
      for (const sprite of entity.sprites) {
        this.renderer.removeSprite(sprite);
      }
    }

    if (entity.onDestroy) {
      entity.onDestroy(this);
    }
  }

  /** Called before physics. */
  private tick(dt: number) {
    this.ticknumber += 1;
    for (const entity of this.entities.withBeforeTick) {
      if (entity.game && !(this.paused && entity.pausable)) {
        entity.beforeTick();
      }
    }
    for (const entity of this.entities.withOnTick) {
      if (entity.game && !(this.paused && entity.pausable)) {
        entity.onTick(dt);
      }
    }
  }

  /** Called after physics. */
  private afterPhysics() {
    this.cleanupEntities();
    for (const entity of this.entities.withAfterPhysics) {
      if (entity.game && !(this.paused && entity.pausable)) {
        entity.afterPhysics();
      }
    }
  }

  /** Called before actually rendering. */
  private render(dt: number) {
    this.cleanupEntities();
    for (const entity of this.entities.withOnRender) {
      if (entity.game) {
        entity.onRender(dt);
      } else {
        console.warn(`entity doesn't have game`);
      }
    }
    for (const entity of this.entities.withOnLateRender) {
      if (entity.game) {
        entity.onLateRender(dt);
      }
    }
    // this.renderer2d?.render();
    this.renderer.render();
  }

  // Handle beginning of collision between things.
  // Fired during narrowphase.
  private beginContact = (contactInfo: ContactInfoWithEquations) => {
    this.contactList.beginContact(contactInfo);
    const { shapeA, shapeB, bodyA, bodyB, contactEquations } = contactInfo;
    const ownerA = shapeA.owner || bodyA.owner;
    const ownerB = shapeB.owner || bodyB.owner;

    // If either owner has been removed from the game, we shouldn't do the contact
    if (!(ownerA && !ownerA.game) || (ownerB && !ownerB.game)) {
      if (ownerA?.onBeginContact) {
        ownerA.onBeginContact(ownerB, shapeA, shapeB, contactEquations);
      }
      if (ownerB?.onBeginContact) {
        ownerB.onBeginContact(ownerA, shapeB, shapeA, contactEquations);
      }
    }
  };

  // Handle end of collision between things.
  // Fired during narrowphase.
  private endContact = (contactInfo: ContactInfo) => {
    this.contactList.endContact(contactInfo);
    const { shapeA, shapeB, bodyA, bodyB } = contactInfo;
    const ownerA = shapeA.owner || bodyA.owner;
    const ownerB = shapeB.owner || bodyB.owner;

    // If either owner has been removed from the game, we shouldn't do the contact
    if (!(ownerA && !ownerA.game) || (ownerB && !ownerB.game)) {
      if (ownerA?.onEndContact) {
        ownerA.onEndContact(ownerB, shapeA, shapeB);
      }
      if (ownerB?.onEndContact) {
        ownerB.onEndContact(ownerA, shapeB, shapeA);
      }
    }
  };

  private contacts() {
    for (const contactInfo of this.contactList.getContacts()) {
      const { shapeA, shapeB, bodyA, bodyB, contactEquations } = contactInfo;
      const ownerA = shapeA.owner || bodyA.owner;
      const ownerB = shapeB.owner || bodyB.owner;
      if (ownerA?.onContacting) {
        ownerA.onContacting(ownerB, shapeA, shapeB, contactEquations);
      }
      if (ownerB?.onContacting) {
        ownerB.onContacting(ownerA, shapeB, shapeA, contactEquations);
      }
    }
  }

  // Handle collision between things.
  // Fired after physics step.
  private impact = (e: {
    bodyA: p2.Body & WithOwner;
    bodyB: p2.Body & WithOwner;
  }) => {
    const ownerA = e.bodyA.owner;
    const ownerB = e.bodyB.owner;
    // If either owner has been removed from the game, we shouldn't do the contact
    if (!(ownerA && !ownerA.game) || (ownerB && !ownerB.game)) {
      if (ownerA?.onImpact) {
        ownerA.onImpact(ownerB);
      }
      if (ownerB?.onImpact) {
        ownerB.onImpact(ownerA);
      }
    }
  };
}
