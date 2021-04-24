import type Entity from "./entity/Entity";
import type { WithOwner } from "./entity/Entity";
import type IOEventHandler from "./entity/IOEventHandler";

export type EntityFilter<T extends Entity> = (e: Entity) => e is T;

type EntityWithAfterPhysics = Entity & { afterPhysics: Function };
export const hasAfterPhysics = (e: Entity): e is EntityWithAfterPhysics =>
  Boolean(e.afterPhysics);

type EntityWithBeforeTick = Entity & { beforeTick: Function };
export const hasBeforeTick = (e: Entity): e is EntityWithBeforeTick =>
  Boolean(e.beforeTick);

type EntityWithOnRender = Entity & { onRender: Function };
export const hasOnRender = (e: Entity): e is EntityWithOnRender =>
  Boolean(e.onRender);

type EntityWithOnLateRender = Entity & { onLateRender: Function };
export const hasOnLateRender = (e: Entity): e is EntityWithOnLateRender =>
  Boolean(e.onLateRender);

type EntityWithOnTick = Entity & { onTick: Function };
export const hasOnTick = (e: Entity): e is EntityWithOnTick =>
  Boolean(e.onTick);

type EntityWithOnPause = Entity & { onPause: Function };
export const hasOnPause = (e: Entity): e is EntityWithOnPause =>
  Boolean(e.onPause);

type EntityWithOnResize = Entity & { onResize: Function };
export const hasOnResize = (e: Entity): e is EntityWithOnResize =>
  Boolean(e.onResize);

type EntityWithOnUnpause = Entity & { onUnpause: Function };
export const hasOnUnpause = (e: Entity): e is EntityWithOnUnpause =>
  Boolean(e.onUnpause);

type EntityWithBody = Entity & { body: Body & WithOwner };
export const hasBody = (e: Entity): e is EntityWithBody => Boolean(e.body);

// IO Stuff
type IOEventHandlerWithOnButtonDown = IOEventHandler & {
  onButtonDown: Function;
};
export const hasOnButtonDown = (
  e: IOEventHandler
): e is IOEventHandlerWithOnButtonDown => Boolean(e.onButtonDown);

type IOEventHandlerWithOnButtonUp = IOEventHandler & { onButtonUp: Function };
export const hasOnButtonUp = (
  e: IOEventHandler
): e is IOEventHandlerWithOnButtonUp => Boolean(e.onButtonUp);

type IOEventHandlerWithOnClick = IOEventHandler & { onClick: Function };
export const hasOnClick = (e: IOEventHandler): e is IOEventHandlerWithOnClick =>
  Boolean(e.onClick);

type IOEventHandlerWithOnKeyDown = IOEventHandler & { onKeyDown: Function };
export const hasOnKeyDown = (
  e: IOEventHandler
): e is IOEventHandlerWithOnKeyDown => Boolean(e.onKeyDown);

type IOEventHandlerWithOnKeyUp = IOEventHandler & { onKeyUp: Function };
export const hasOnKeyUp = (e: IOEventHandler): e is IOEventHandlerWithOnKeyUp =>
  Boolean(e.onKeyUp);

type IOEventHandlerWithOnMouseDown = IOEventHandler & { onMouseDown: Function };
export const hasOnMouseDown = (
  e: IOEventHandler
): e is IOEventHandlerWithOnMouseDown => Boolean(e.onMouseDown);

type IOEventHandlerWithOnMouseUp = IOEventHandler & { onMouseUp: Function };
export const hasOnMouseUp = (
  e: IOEventHandler
): e is IOEventHandlerWithOnMouseUp => Boolean(e.onMouseUp);

type IOEventHandlerWithOnRightClick = IOEventHandler & {
  onRightClick: Function;
};
export const hasOnRightClick = (
  e: IOEventHandler
): e is IOEventHandlerWithOnRightClick => Boolean(e.onRightClick);

type IOEventHandlerWithOnRightDown = IOEventHandler & { onRightDown: Function };
export const hasOnRightDown = (
  e: IOEventHandler
): e is IOEventHandlerWithOnRightDown => Boolean(e.onRightDown);

type IOEventHandlerWithOnRightUp = IOEventHandler & { onRightUp: Function };
export const hasOnRightUp = (
  e: IOEventHandler
): e is IOEventHandlerWithOnRightUp => Boolean(e.onRightUp);

type IOEventHandlerWithOnInputDeviceChange = IOEventHandler & {
  onInputDeviceChange: Function;
};
export const hasOnInputDeviceChange = (
  e: IOEventHandler
): e is IOEventHandlerWithOnInputDeviceChange => Boolean(e.onInputDeviceChange);
