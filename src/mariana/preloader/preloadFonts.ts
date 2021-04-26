import fnt_montserratBlack from "../../../resources/fonts/Montserrat/Montserrat-Black.ttf";
import fnt_montserratLight from "../../../resources/fonts/Montserrat/Montserrat-Light.ttf";

export function getFontsToPreload() {
  return [
    new FontFace("Montserrat Black", `url(${fnt_montserratBlack})`),
    new FontFace("Montserrat Light", `url(${fnt_montserratLight})`),
  ];
}
