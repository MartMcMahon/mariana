import Entity, { WithOwner } from "./Entity";
import { Shape, ContactEquation } from "p2";

/**
 * Physics specific properties of an entity.
 */
export default interface EntityPhysics {
  /** Physics body that gets automatically added/removed from the world */
  readonly body?: p2.Body & WithOwner;

  /** Physics bodies that gets automatically added/removed from the world */
  readonly bodies?: readonly (p2.Body & WithOwner)[];

  /** Physics springs that gets automatically added/removed from the world */
  readonly springs?: p2.Spring[];

  /** Physics constraints that gets automatically added/removed from the world */
  readonly constraints?: p2.Constraint[];

  /** Called when a physics contact starts */
  onBeginContact?(
    other?: Entity,
    thisShape?: Shape,
    otherShape?: Shape,
    contactEquations?: ContactEquation[]
  ): void;
  /** Called when a physics contact ends */
  onEndContact?(other?: Entity, thisShape?: Shape, otherShape?: Shape): void;
  /** Called every after the physics step */
  onContacting?(
    other?: Entity,
    thisShape?: Shape,
    otherShape?: Shape,
    contactEquations?: ContactEquation[]
  ): void;
  /** Called when a physics impact happens */
  onImpact?(other?: Entity): void;
}
