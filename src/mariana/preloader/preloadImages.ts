import img_angler1 from "../../../resources/images/angler_1.png";
import img_background from "../../../resources/images/background.png";
import img_boat from "../../../resources/images/boat.png";
import img_bubble from "../../../resources/images/bubble.png";
import img_diver from "../../../resources/images/diver.png";
import img_diverLeft from "../../../resources/images/diver_left.png";
import img_diverRight from "../../../resources/images/diver_right.png";
import img_harpoon from "../../../resources/images/harpoon.png";
import img_jellyfish from "../../../resources/images/jellyfish.png";
import img_jellyfish1 from "../../../resources/images/jellyfish_1.png";
import img_jellyfish2 from "../../../resources/images/jellyfish_2.png";
import img_pickup1 from "../../../resources/images/pickup-1.png";
import img_pickup2 from "../../../resources/images/pickup-2.png";
import img_pickup4 from "../../../resources/images/pickup-4.png";
import img_pickup5 from "../../../resources/images/pickup-5.png";
import img_pickup6 from "../../../resources/images/pickup-6.png";
import img_pickup7 from "../../../resources/images/pickup-7.png";
import img_pickup8 from "../../../resources/images/pickup-8.png";
import img_puffer0 from "../../../resources/images/puffer0.png";
import img_puffer1 from "../../../resources/images/puffer1.png";
import img_puffer2 from "../../../resources/images/puffer2.png";
import img_puffer3 from "../../../resources/images/puffer3.png";
import img_puffer4 from "../../../resources/images/puffer4.png";
import img_stingRay1 from "../../../resources/images/sting_ray_1.png";
import img_stingRay2 from "../../../resources/images/sting_ray_2.png";

// Returns the list of all
export function getImagesToPreload(): Set<string> {
  // use a set to make sure we don't include stuff multiple times
  const urls = new Set([
    img_angler1,
    img_background,
    img_boat,
    img_bubble,
    img_diver,
    img_diverLeft,
    img_diverRight,
    img_harpoon,
    img_jellyfish,
    img_jellyfish1,
    img_jellyfish2,
    img_pickup1,
    img_pickup2,
    img_pickup4,
    img_pickup5,
    img_pickup6,
    img_pickup7,
    img_pickup8,
    img_puffer0,
    img_puffer1,
    img_puffer2,
    img_puffer3,
    img_puffer4,
    img_stingRay1,
    img_stingRay2,
  ]);

  // Just in case this sneaks in there somehow, make sure we don't load it
  urls.delete(undefined!);

  return urls;
}
