import p2 from "p2";
import { WithOwner } from "./entity/Entity";

export interface ContactInfo {
  bodyA: p2.Body & WithOwner;
  bodyB: p2.Body & WithOwner;
  shapeA: p2.Shape & WithOwner;
  shapeB: p2.Shape & WithOwner;
}

export interface ContactInfoWithEquations extends ContactInfo {
  contactEquations: p2.ContactEquation[];
}

export default class ContactList {
  private contacts: ContactInfoWithEquations[] = [];

  beginContact(contactInfo: ContactInfoWithEquations) {
    if (shouldTrack(contactInfo)) {
      this.contacts.push(contactInfo);
    }
  }

  endContact(contactInfo: ContactInfo) {
    if (shouldTrack(contactInfo)) {
      const index = this.contacts.findIndex((info) =>
        contactsAreEqual(info, contactInfo)
      );
      this.contacts.splice(index, 1);
    }
  }

  getContacts(): ReadonlyArray<ContactInfoWithEquations> {
    return this.contacts;
  }
}

/** Whether or not this is a collision we need to keep track of */
function shouldTrack({ shapeA, shapeB, bodyA, bodyB }: ContactInfo): boolean {
  return true;
}

/** Whether or not two ContactInfos represent the same contact */
function contactsAreEqual(a: ContactInfo, b: ContactInfo): boolean {
  return (
    (a.bodyA === b.bodyA &&
      a.bodyB === b.bodyB &&
      a.shapeA === b.shapeA &&
      a.shapeB === b.shapeB) ||
    (a.bodyA === b.bodyB &&
      a.bodyB === b.bodyA &&
      a.shapeA === b.shapeB &&
      a.shapeB === b.shapeA)
  );
}
