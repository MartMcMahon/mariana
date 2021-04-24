import * as Pixi from "pixi.js";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import Game from "../../core/Game";
import {
  getBiggestSounds,
  getTotalSoundBytes,
  loadSound,
} from "../../core/resources/sounds";
import { getFontsToPreload } from "./preloadFonts";
import { getImagesToPreload } from "./preloadImages";
import { getSoundsToPreload } from "./preloadSounds";

export default class Preloader extends BaseEntity implements Entity {
  private _resolve!: () => void;
  private _promise!: Promise<void>;

  constructor() {
    super();

    this._promise = new Promise((resolve) => {
      this._resolve = resolve;
    });
  }

  async onAdd(game: Game) {
    await Promise.all([
      this.loadFonts(),
      this.loadSounds(game.audio),
      this.loadImages(),
    ]);
    const bytes = getTotalSoundBytes();

    console.group(`Audio Loaded: ${(bytes / 2 ** 20).toFixed(1)}MB total`);

    getBiggestSounds()
      .slice(0, 10)
      .forEach(([url, size]) =>
        console.log(url, "\n", `${(size / 1024).toFixed(1)}kB`)
      );

    console.groupEnd();
    this._resolve();
  }

  waitTillLoaded() {
    return this._promise;
  }

  async loadFonts() {
    const fonts = getFontsToPreload();
    let loaded = 0;
    const total = fonts.length;
    const element = document.getElementById("font-count")!;
    element.innerText = `${loaded} / ${total}`;

    await Promise.all(
      fonts.map(async (font) => {
        document.fonts.add(await font.load());
        loaded += 1;
        element.innerText = `${loaded} / ${total}`;
      })
    );
  }

  async loadSounds(audioContext: AudioContext) {
    const urls = getSoundsToPreload();
    let loaded = 0;
    const total = urls.length;
    const element = document.getElementById("sound-count")!;
    element.innerText = `${loaded} / ${total}`;

    await Promise.all(
      urls.map(async (url) => {
        try {
          await loadSound(url, audioContext);
        } catch (e) {
          console.warn(`Sound failed to load: ${url}, ${url}`, e);
        }
        loaded += 1;
        element.innerText = `${loaded} / ${total}`;
      })
    );
  }

  async loadImages() {
    const imageUrls = getImagesToPreload();

    let loaded = 0;
    const total = imageUrls.size;
    const element = document.getElementById("image-count")!;
    element.innerText = `${loaded} / ${total}`;

    const loader = Pixi.Loader.shared;
    for (const imageUrl of imageUrls) {
      loader.add(imageUrl);
    }

    loader.onProgress.add((_) => {
      loaded += 1;
      element.innerText = `${loaded} / ${total}`;
    });
    loader.onError.add((_, image) => {
      console.warn(`Image failed to load`, image);
    });
    const completePromise = new Promise<void>((resolve) =>
      loader.onComplete.add(() => resolve())
    );

    loader.load();

    await completePromise;
  }

  onDestroy() {
    document.getElementById("preloader")?.remove();
  }
}
