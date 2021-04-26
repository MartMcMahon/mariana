import snd_aboveWaterMusic from "../../../resources/audio/above_water_music.flac";
import snd_bellPositive1 from "../../../resources/audio/bell_positive_1.flac";
import snd_bellPositive2 from "../../../resources/audio/bell_positive_2.flac";
import snd_bellTension from "../../../resources/audio/bell_tension.flac";
import snd_bellTensionResolve from "../../../resources/audio/bell_tension_resolve.flac";
import snd_bellTritone from "../../../resources/audio/bell_tritone.flac";
import snd_breatheIn1 from "../../../resources/audio/breathe_in_1.flac";
import snd_breatheIn2 from "../../../resources/audio/breathe_in_2.flac";
import snd_breatheOut1 from "../../../resources/audio/breathe_out_1.flac";
import snd_breatheOut2 from "../../../resources/audio/breathe_out_2.flac";
import snd_dead from "../../../resources/audio/dead.flac";
import snd_ding from "../../../resources/audio/ding.flac";
import snd_fleshHit1 from "../../../resources/audio/flesh-hit-1.flac";
import snd_fleshHit2 from "../../../resources/audio/flesh-hit-2.flac";
import snd_fleshHit3 from "../../../resources/audio/flesh-hit-3.flac";
import snd_fleshHit4 from "../../../resources/audio/flesh-hit-4.flac";
import snd_harpoonHitGround1 from "../../../resources/audio/harpoon_hit_ground_1.flac";
import snd_metalHittingRock from "../../../resources/audio/metal_hitting_rock.flac";
import snd_oceanTexture from "../../../resources/audio/ocean_texture.flac";
import snd_oww from "../../../resources/audio/oww.flac";
import snd_reel from "../../../resources/audio/reel.flac";
import snd_reelInHarpoon from "../../../resources/audio/reel_in_harpoon.flac";
import snd_sharkMiss from "../../../resources/audio/shark-miss.flac";
import snd_sharkbite from "../../../resources/audio/sharkbite.flac";
import snd_smallweapon1 from "../../../resources/audio/smallweapon1.flac";
import snd_smallweapon2 from "../../../resources/audio/smallweapon2.flac";
import snd_smallweapon3 from "../../../resources/audio/smallweapon3.flac";
import snd_smallweapon4 from "../../../resources/audio/smallweapon4.flac";
import snd_spear1 from "../../../resources/audio/spear1.flac";
import snd_spear2 from "../../../resources/audio/spear2.flac";
import snd_spear3 from "../../../resources/audio/spear3.flac";
import snd_spear4 from "../../../resources/audio/spear4.flac";
import snd_splash from "../../../resources/audio/splash.flac";
import snd_spookySinking from "../../../resources/audio/spooky_sinking.flac";

export function getSoundsToPreload(): string[] {
  // use a set to make sure we don't include stuff multiple times
  const urls = new Set<string>([
    snd_aboveWaterMusic,
    snd_bellPositive1,
    snd_bellPositive2,
    snd_bellTension,
    snd_bellTensionResolve,
    snd_bellTritone,
    snd_breatheIn1,
    snd_breatheIn2,
    snd_breatheOut1,
    snd_breatheOut2,
    snd_dead,
    snd_ding,
    snd_fleshHit1,
    snd_fleshHit2,
    snd_fleshHit3,
    snd_fleshHit4,
    snd_metalHittingRock,
    snd_oceanTexture,
    snd_oww,
    snd_reel,
    snd_reelInHarpoon,
    snd_sharkbite,
    snd_sharkMiss,
    snd_smallweapon1,
    snd_smallweapon2,
    snd_smallweapon3,
    snd_smallweapon4,
    snd_spear1,
    snd_spear2,
    snd_spear3,
    snd_spear4,
    snd_splash,
    snd_spookySinking,
  ]);

  // Just in case this sneaks in there somehow, make sure we don't load it
  urls.delete(undefined!);

  return Array.from(urls);
}
