import p2, { Constraint, Spring } from "p2";
import Game from "../Game";
import { clamp } from "../util/MathUtil";
import { V, V2d } from "../Vector";
import Entity, { GameSprite } from "./Entity";
import { CustomHandlersMap } from "./GameEventHandler";

/**
 * Base class for lots of stuff in the game.
 */
export default abstract class BaseEntity implements Entity {
  bodies?: p2.Body[];
  body?: p2.Body;
  children: Entity[] = [];
  constraints?: Constraint[];
  game: Game | undefined = undefined;
  handlers: CustomHandlersMap = {};
  parent?: Entity;
  pausable: boolean = true;
  persistenceLevel: number = 0;
  springs?: Spring[];
  id?: string;
  sprite?: GameSprite;
  sprites?: GameSprite[];

  // Convert local coordinates to world coordinates.
  // Requires a body
  localToWorld(localPoint: [number, number]): V2d {
    if (this.body) {
      const result: V2d = V(0, 0);
      this.body.toWorldFrame(result, localPoint);
      return result;
    }
    return V(0, 0);
  }

  getPosition(): V2d {
    if (this.body) {
      return V(this.body.position);
    }
    throw new Error("Position is not implemented for this entity");
  }

  get isDestroyed() {
    return this.game == null;
  }

  // Removes this from the game. You probably shouldn't override this method.
  destroy() {
    if (this.game) {
      this.game.removeEntity(this);
      while (this.children?.length) {
        this.children[this.children.length - 1].destroy();
      }
      if (this.parent) {
        const pChildren = this.parent.children!;
        const index = pChildren.lastIndexOf(this);
        if (index < 0) {
          throw new Error(`Parent doesn't have child`);
        }
        pChildren.splice(index, 1);
      }
    }
  }

  addChild<T extends Entity>(child: T, changeParent: boolean = false): T {
    if (child.parent) {
      if (changeParent) {
        // This can lead to weird state where a child is added but its parent isn't, dunno if that's bad
        const oldParent = child.parent;
        oldParent.children!.splice(oldParent.children!.indexOf(child), 1);
      } else {
        throw new Error("Child already has a parent.");
      }
    }
    child.parent = this;
    this.children = this.children ?? [];
    this.children.push(child);

    if (this.game && !child.game) {
      this.game.addEntity(child);
    }
    return child;
  }

  addChildren(...children: readonly Entity[]): void {
    for (const child of children) {
      this.addChild(child);
    }
  }

  /**
   * Fulfills after the given amount of game time.
   * Use with delay=0 to wait until the next tick.
   * @param onTick  Do something every tick while waiting
   */
  wait(
    delay: number = 0,
    onTick?: (dt: number, t: number) => void,
    timerId?: string
  ): Promise<void> {
    return new Promise((resolve) => {
      const timer = new Timer(delay, () => resolve(), onTick, timerId);
      timer.persistenceLevel = this.persistenceLevel;
      this.addChild(timer);
    });
  }

  /**
   * Wait until a condition is filled. Probably not great to use, but seems kinda cool too.
   */
  waitUntil(
    predicate: () => boolean,
    onTick?: (dt: number, t: number) => void,
    timerId?: string
  ): Promise<void> {
    return new Promise((resolve) => {
      const timer = new Timer(
        Infinity,
        () => resolve(),
        (dt, t) => {
          if (onTick) {
            onTick(dt, t);
          }
          if (predicate()) {
            timer.timeRemaining = 0;
          }
        },
        timerId
      );
      timer.persistenceLevel = this.persistenceLevel;
      this.addChild(timer);
    });
  }

  /**
   * Remove all timers from this instance. i.e. cancel all 'waits'.
   */
  clearTimers(timerId?: string): void {
    if (this.children) {
      const timers = this.children.filter(isTimer);
      for (const timer of timers) {
        if (!timerId || timerId === timer.timerId) {
          timer.destroy();
        }
      }
    }
  }

  /**
   * Update the time remaing on a timer (or all timers).
   */
  updateTimers(value: number = 0, timerId?: string): void {
    if (this.children) {
      const timers = this.children.filter(isTimer);
      for (const timer of timers) {
        if (!timerId || timerId === timer.timerId) {
          timer.timeRemaining = value;
        }
      }
    }
  }
}

class Timer extends BaseEntity implements Entity {
  timeRemaining: number = 0;
  endEffect?: () => void;
  duringEffect?: (dt: number, t: number) => void;

  constructor(
    private delay: number,
    endEffect?: () => void,
    duringEffect?: (dt: number, t: number) => void,
    public timerId?: string
  ) {
    super();
    this.timeRemaining = delay;
    this.endEffect = endEffect;
    this.duringEffect = duringEffect;
  }

  onTick(dt: number) {
    this.timeRemaining -= dt;
    const t = clamp(1.0 - this.timeRemaining / this.delay);
    this.duringEffect?.(dt, t);
    if (this.timeRemaining <= 0) {
      this.endEffect?.();
      this.destroy();
    }
  }
}

function isTimer(e?: Entity): e is Timer {
  return e instanceof Timer;
}
