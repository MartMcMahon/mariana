export type SoundName = string;

// Stores all loaded buffers
const buffers: Map<string, AudioBuffer> = new Map();

// Whether or not a buffer has been loaded for a url
export function hasSoundBuffer(url: string): boolean {
  return buffers.has(url);
}

// Get the buffer loaded for a url or throw if none has been loaded
export function getSoundBuffer(url: string): AudioBuffer {
  const buffer = buffers.get(url);
  if (!buffer) {
    throw new Error(`Audio Buffer not loaded: ${url}`);
  }
  return buffer;
}

// Keeps track of filesizes, for figuring out how to optimize our asset loading
const fileSizes = new Map<string, number>();

export function getTotalSoundBytes() {
  return [...fileSizes.values()].reduce((sum, current) => sum + current, 0);
}

export function getBiggestSounds() {
  const entries = [...fileSizes.entries()];
  entries.sort(([url1, size1], [url2, size2]) => size2 - size1);
  return entries;
}

export function getSoundFileSize(url: SoundName): number {
  if (!fileSizes.has(url)) {
    throw new Error(`Sound not loaded: ${url}`);
  }
  return fileSizes.get(url)!;
}

export async function loadSound(
  url: string,
  audioContext: AudioContext
): Promise<AudioBuffer> {
  return fetch(url)
    .then((response) => {
      const bytes = Number(response.headers.get("Content-Length"));
      fileSizes.set(url, bytes);
      return response.arrayBuffer();
    })
    .then((data) => audioContext.decodeAudioData(data))
    .then((buffer) => {
      buffers.set(url, buffer);
      return buffer;
    });
}

export function getSoundDuration(soundName: SoundName): number {
  return buffers.get(soundName)?.duration ?? -1;
}

export function soundIsLoaded(name: SoundName) {
  return buffers.get(name) != undefined;
}
