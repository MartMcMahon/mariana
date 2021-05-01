import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import Game from "../../core/Game";
import { KeyCode } from "../../core/io/Keys";

export enum GraphicsQuality {
  Low = "Low",
  Medium = "Medium",
  High = "High",
}

function parseQuality(quality: string | null): GraphicsQuality | undefined {
  if (!quality) {
    return undefined;
  }
  for (const value of Object.values(GraphicsQuality)) {
    if (value === quality) {
      return value;
    }
  }
  return undefined;
}

export type GraphicsQualtiyEvent = {
  type: "graphicsQualityChanged";
  quality: GraphicsQuality;
};

const DEFAULT_QUALITY = GraphicsQuality.High;

const MAX_RESOLUTION = window.devicePixelRatio || 1;

export class GraphicsQualityController extends BaseEntity implements Entity {
  id = "graphicsQualityController";

  persistenceLevel = 2;
  pausable = false;

  currentQuality: GraphicsQuality = DEFAULT_QUALITY;

  constructor() {
    super();
    const savedQuality = parseQuality(localStorage.getItem("graphicsQuality"));
    this.currentQuality = savedQuality ?? DEFAULT_QUALITY;
  }

  onAdd() {
    this.setGraphicsQuality(this.currentQuality);
  }

  setGraphicsQuality(quality: GraphicsQuality) {
    this.currentQuality = quality;
    this.game?.dispatch({ type: "graphicsQualityChanged", quality });
    localStorage.setItem("graphicsQuality", quality);
  }

  nextGraphicsQuality() {
    if (this.currentQuality === GraphicsQuality.Low) {
      this.setGraphicsQuality(GraphicsQuality.Medium);
    } else if (this.currentQuality === GraphicsQuality.Medium) {
      this.setGraphicsQuality(GraphicsQuality.High);
    } else {
      this.setGraphicsQuality(GraphicsQuality.Low);
    }
  }

  handlers = {
    toggleGraphicsQuality: () => {
      this.nextGraphicsQuality();
    },

    graphicsQualityChanged: ({ quality }: { quality: GraphicsQuality }) => {
      const game = this.game;
      if (game) {
        const resolution = getResolutionForGraphicsQuality(quality);
        game.renderer.setResolution(resolution);
      }
    },
  };
}

export function getCurrentGraphicsQuality(game: Game): GraphicsQuality {
  const controller = game.entities.getById(
    "graphicsQualityController"
  ) as GraphicsQualityController;
  return controller.currentQuality;
}

export function getResolutionForGraphicsQuality(
  quality: GraphicsQuality
): number {
  switch (quality) {
    case GraphicsQuality.Low:
      return MAX_RESOLUTION / 4;
    case GraphicsQuality.Medium:
      return MAX_RESOLUTION / 2;
    case GraphicsQuality.High:
      return MAX_RESOLUTION;
  }
}
