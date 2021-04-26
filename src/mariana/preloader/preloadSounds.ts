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
import snd_dialogHelmetHeadedOut from "../../../resources/audio/dialog_helmet_headed_out.flac";
import snd_dialogHelmetImHungry from "../../../resources/audio/dialog_helmet_im_hungry.flac";
import snd_dialogHelmetMmhmm from "../../../resources/audio/dialog_helmet_mmhmm.flac";
import snd_dialogHelmetPain1 from "../../../resources/audio/dialog_helmet_pain1.flac";
import snd_dialogHelmetPain2 from "../../../resources/audio/dialog_helmet_pain2.flac";
import snd_dialogHelmetPain3 from "../../../resources/audio/dialog_helmet_pain3.flac";
import snd_dialogHelmetPain4 from "../../../resources/audio/dialog_helmet_pain4.flac";
import snd_dialogHelmetPain5 from "../../../resources/audio/dialog_helmet_pain5.flac";
import snd_dialogHelmetPain6 from "../../../resources/audio/dialog_helmet_pain6.flac";
import snd_dialogHelmetPain7 from "../../../resources/audio/dialog_helmet_pain7.flac";
import snd_dialogRadioHeadedOut from "../../../resources/audio/dialog_radio_headed_out.flac";
import snd_dialogRadioImHungry from "../../../resources/audio/dialog_radio_im_hungry.flac";
import snd_dialogRadioMmhmm from "../../../resources/audio/dialog_radio_mmhmm.flac";
import snd_dialogRadioPain1 from "../../../resources/audio/dialog_radio_pain1.flac";
import snd_dialogRadioPain2 from "../../../resources/audio/dialog_radio_pain2.flac";
import snd_dialogRadioPain3 from "../../../resources/audio/dialog_radio_pain3.flac";
import snd_dialogRadioPain4 from "../../../resources/audio/dialog_radio_pain4.flac";
import snd_dialogRadioPain5 from "../../../resources/audio/dialog_radio_pain5.flac";
import snd_dialogRadioPain6 from "../../../resources/audio/dialog_radio_pain6.flac";
import snd_dialogRadioPain7 from "../../../resources/audio/dialog_radio_pain7.flac";
import snd_ding from "../../../resources/audio/ding.flac";
import snd_fleshHit1 from "../../../resources/audio/flesh-hit-1.flac";
import snd_fleshHit2 from "../../../resources/audio/flesh-hit-2.flac";
import snd_fleshHit3 from "../../../resources/audio/flesh-hit-3.flac";
import snd_fleshHit4 from "../../../resources/audio/flesh-hit-4.flac";
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
    snd_dialogHelmetHeadedOut,
    snd_dialogHelmetImHungry,
    snd_dialogHelmetMmhmm,
    snd_dialogHelmetPain1,
    snd_dialogHelmetPain2,
    snd_dialogHelmetPain3,
    snd_dialogHelmetPain4,
    snd_dialogHelmetPain5,
    snd_dialogHelmetPain6,
    snd_dialogHelmetPain7,
    snd_dialogRadioHeadedOut,
    snd_dialogRadioImHungry,
    snd_dialogRadioMmhmm,
    snd_dialogRadioPain1,
    snd_dialogRadioPain2,
    snd_dialogRadioPain3,
    snd_dialogRadioPain4,
    snd_dialogRadioPain5,
    snd_dialogRadioPain6,
    snd_dialogRadioPain7,
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
