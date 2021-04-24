import Entity from "./entity/Entity";
import {
  EntityFilter,
  hasAfterPhysics,
  hasBeforeTick,
  hasBody,
  hasOnPause,
  hasOnRender,
  hasOnLateRender,
  hasOnTick,
  hasOnUnpause,
  hasOnResize,
} from "./EntityFilter";
import { FilterListMap } from "./util/FilterListMap";
import ListMap from "./util/ListMap";

/**
 * Keeps track of entities. Has lots of useful indexes.
 */
export default class EntityList implements Iterable<Entity> {
  private idToEntity = new Map<string, Entity>();
  private tagged = new ListMap<string, Entity>();
  private handlers = new ListMap<string, Entity>();
  private filters = new FilterListMap<Entity>();

  all = new Set<Entity>();

  constructor() {
    this.addFilter(hasAfterPhysics);
    this.addFilter(hasBeforeTick);
    this.addFilter(hasOnRender);
    this.addFilter(hasOnLateRender);
    this.addFilter(hasOnTick);
    this.addFilter(hasOnPause);
    this.addFilter(hasOnUnpause);
    this.addFilter(hasOnResize);
    this.addFilter(hasBody);
  }

  get withAfterPhysics() {
    return this.getByFilter(hasAfterPhysics);
  }
  get withBeforeTick() {
    return this.getByFilter(hasBeforeTick);
  }
  get withOnRender() {
    return this.getByFilter(hasOnRender);
  }
  get withOnLateRender() {
    return this.getByFilter(hasOnLateRender);
  }
  get withOnTick() {
    return this.getByFilter(hasOnTick);
  }
  get withOnPause() {
    return this.getByFilter(hasOnPause);
  }
  get withOnUnpause() {
    return this.getByFilter(hasOnUnpause);
  }
  get withOnResize() {
    return this.getByFilter(hasOnResize);
  }
  get withBody() {
    return this.getByFilter(hasBody);
  }

  /**
   * Adds an entity to this list and all sublists and does all the bookkeeping
   */
  add(entity: Entity) {
    this.all.add(entity);

    this.filters.addItem(entity);

    if (entity.tags) {
      for (const tag of entity.tags) {
        this.tagged.add(tag, entity);
      }
    }

    if (entity.handlers) {
      for (const handler of Object.keys(entity.handlers)) {
        this.handlers.add(handler, entity);
      }
    }

    if (entity.id) {
      if (this.idToEntity.has(entity.id)) {
        throw new Error(`entities with duplicate ids: ${entity.id}`);
      }
      this.idToEntity.set(entity.id, entity);
    }
  }

  /**
   * Removes an entity from this list and all the sublists and does some bookkeeping
   */
  remove(entity: Entity) {
    this.all.delete(entity);

    this.filters.removeItem(entity);

    if (entity.tags) {
      for (const tag of entity.tags) {
        this.tagged.remove(tag, entity);
      }
    }

    if (entity.handlers) {
      for (const handler of Object.keys(entity.handlers)) {
        this.handlers.remove(handler, entity);
      }
    }

    if (entity.id) {
      this.idToEntity.delete(entity.id);
    }
  }

  /**
   * Get the entity with the given id.
   */
  getById(id: string) {
    return this.idToEntity.get(id);
  }

  /** Returns all entities with the given tag. */
  getTagged(tag: string): readonly Entity[] {
    return this.tagged.get(tag);
  }

  /** Returns all entities that have all the given tags */
  getTaggedAll(...tags: string[]): Entity[] {
    if (tags.length === 0) {
      return [];
    }
    return this.getTagged(tags[0]).filter((e) =>
      tags.every((t) => e.tags!.includes(t))
    );
  }

  /** Returns all entities that have at least one of the given tags */
  getTaggedAny(...tags: string[]): Entity[] {
    const result = new Set<Entity>();
    for (const tag of tags) {
      for (const e of this.getTagged(tag)) {
        result.add(e);
      }
    }
    return [...result];
  }

  /**
   * Adds a filter for fast lookup with getByFilter() in the future.
   */
  addFilter<T extends Entity>(filter: EntityFilter<T>): void {
    this.filters.addFilter(filter, this.all);
  }

  /**
   * Removes a filter.
   */
  removeFilter<T extends Entity>(filter: EntityFilter<T>): void {
    this.filters.removeFilter(filter);
  }

  /**
   * Return all the entities that pass a type guard
   * Then we could replace the hardCoded filters with something nicer
   */
  getByFilter<T extends Entity>(filter: EntityFilter<T>): Iterable<T> {
    const result = this.filters.getFilterList(filter);
    return result ?? [...this.all].filter(filter);
  }

  /**
   * Get all entities that handle a specific event type
   */
  getHandlers(eventType: string): ReadonlyArray<Entity> {
    return this.handlers.get(eventType);
  }

  /**
   * Iterate through all the entities.
   */
  [Symbol.iterator]() {
    return this.all[Symbol.iterator]();
  }
}
