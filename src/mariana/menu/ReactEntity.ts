import React from "react";
import ReactDOM from "react-dom";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";

/** Useful for rendering react to the screen when you want it */
export class ReactEntity<Props> extends BaseEntity implements Entity {
  el!: HTMLDivElement;

  constructor(private getContent: () => React.ReactElement) {
    super();
  }

  reactRender() {
    ReactDOM.render(this.getContent(), this.el);
  }

  onRender() {
    this.reactRender();
  }

  onAdd() {
    this.el = document.createElement("div");
    document.body.append(this.el);
    this.reactRender();
  }

  onDestroy() {
    this.el.remove();
  }
}
