import snd_dead from "../../../resources/audio/dead.flac";
import snd_oceanTexture from "../../../resources/audio/ocean_texture.wav";
import snd_oww from "../../../resources/audio/oww.flac";
import snd_spookySinking from "../../../resources/audio/spooky_sinking.flac";

export function getSoundsToPreload(): string[] {
  // use a set to make sure we don't include stuff multiple times
  const urls = new Set<string>([
    snd_oww,
    snd_dead,
    snd_oceanTexture,
    snd_spookySinking,
  ]);

  // Just in case this sneaks in there somehow, make sure we don't load it
  urls.delete(undefined!);

  return Array.from(urls);
}
