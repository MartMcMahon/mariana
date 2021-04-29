import Game from "../../core/Game";
import {
  getCurrentGraphicsQuality,
  GraphicsQuality,
  GraphicsQualtiyEvent,
} from "../controllers/GraphicsQualityController";
import ClickableText from "./ClickableText";

export default class MuteButton extends ClickableText {
  constructor() {
    super("Graphics: ", () => {
      this.game?.dispatch({ type: "toggleGraphicsQuality" });
    });
  }

  onAdd(game: Game) {
    this.updateText(getCurrentGraphicsQuality(game));
  }

  updateText(quality: GraphicsQuality) {
    this.sprite.text = `Graphics: ${quality}`;
  }

  handlers = {
    graphicsQualityChanged: ({ quality }: GraphicsQualtiyEvent) => {
      this.updateText(quality);
    },
  };
}
