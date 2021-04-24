import img_background from "../../../resources/images/background.png";
import img_boat from "../../../resources/images/boat.png";
import img_diver from "../../../resources/images/diver.png";

// Returns the list of all
export function getImagesToPreload(): Set<string> {
  // use a set to make sure we don't include stuff multiple times
  const urls = new Set([img_diver, img_background, img_boat]);

  // Just in case this sneaks in there somehow, make sure we don't load it
  urls.delete(undefined!);

  return urls;
}
