import classNames from "classnames";
import React from "react";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import Game from "../../core/Game";
import { ControllerButton } from "../../core/io/Gamepad";
import { KeyCode } from "../../core/io/Keys";
import { Persistence } from "../config/Persistence";
import { getCurrentGraphicsQuality } from "../controllers/GraphicsQualityController";
import { getVolumeController } from "../controllers/VolumeController";
import "./PauseMenu.css";
import { ReactEntity } from "./ReactEntity";

// Shows the menu when paused, invisible otherwise
export default class PauseMenu extends BaseEntity implements Entity {
  persistenceLevel = Persistence.Game;
  pausable = false;
  reactEntity: ReactEntity<unknown>;

  constructor() {
    super();

    this.reactEntity = this.addChild(
      new ReactEntity(() => <PauseMenuView game={this.game!} />)
    );
  }

  onUnpause() {}

  onKeyDown(key: KeyCode) {
    switch (key) {
      case "KeyP":
      case "Escape":
        this.game?.togglePause();
        break;
    }
  }

  onButtonDown(button: ControllerButton) {
    if (button === ControllerButton.START) {
      this.game?.togglePause();
    }
  }
}

interface Props {
  game: Game;
}

function PauseMenuView({ game }: Props) {
  const graphicsQuality = getCurrentGraphicsQuality(game);
  const muted = getVolumeController(game).muted;
  return (
    <div className={classNames("PauseMenu", { paused: game.paused })}>
      <div className="TopLeft">
        <div
          className="GraphicsButton button"
          onClick={() => game.dispatch({ type: "toggleGraphicsQuality" })}
        >
          Graphics: {graphicsQuality}
        </div>
        <div
          className="MuteButton button"
          onClick={() => game.dispatch({ type: "toggleMute" })}
        >
          {muted ? "Unmute" : "Mute"}
        </div>
      </div>
      <h1>Paused</h1>
      <h2>Press {game.io.usingGamepad ? "START" : "P"} to unpause</h2>
    </div>
  );
}
