import { ContactMaterial, Material } from "p2";
import type Game from "../../core/Game";

// Represents physical materials of bodies. We might not need more than one
export const P2Materials = {
  base: new Material(),
};

// Describes the how two materials interact when they collide
export const ContactMaterials: ReadonlyArray<ContactMaterial> = [
  new ContactMaterial(P2Materials.base, P2Materials.base, {
    restitution: 0.5, // bounciness
  }),
];

// tells the physics engine to use the materials we've defined here
export function initContactMaterials(game: Game) {
  for (const contactMaterial of ContactMaterials) {
    game.world.addContactMaterial(contactMaterial);
  }
}
