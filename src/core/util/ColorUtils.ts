import { clamp } from "./MathUtil";

// Red Green Blue color representation, values between [0, 255].
export type RGB = { r: number; g: number; b: number };
// Hue Saturation Lightness color representation. Values betwee [0, 1].
export type HSL = { h: number; s: number; l: number };
// Hue Saturation Value color representation. Values betwee [0, 1].
export type HSV = { h: number; s: number; v: number };

// Converts int values 0-255 to single hex value
export function rgbToHex({ r, g, b }: RGB): number {
  return clamp(b, 0, 255) + (clamp(g, 0, 255) << 8) + (clamp(r, 0, 255) << 16);
}

// Converts a hex value into r,g,b components
export function hexToRgb(hex: number): RGB {
  return {
    r: hex >> 16,
    g: (hex >> 8) & 0x0000ff,
    b: hex & 0x0000ff,
  };
}

export function hsvToHex(hsv: HSV): number {
  return rgbToHex(hsvToRgb(hsv));
}

export function hslToHex(hsl: HSL): number {
  return rgbToHex(hslToRgb(hsl));
}

// Converts a hex value into h,s,l components
export function hexToHsl(hex: number) {
  return rgbToHsl(hexToRgb(hex));
}

// Converts a hex value into h,s,v components
export function hexToHsv(hex: number) {
  return rgbToHsv(hexToRgb(hex));
}

// Converts a hex value into r,g,b components in vec3 form for shaders
export function hexToVec3(hex: number): [number, number, number] {
  const r = hex >> 16;
  const g = (hex >> 8) & 0x0000ff;
  const b = hex & 0x0000ff;
  return [r / 255.0, g / 255.0, b / 255.0];
}

// given colors "from" and "to", return a hex array [from, x, y, z, to]
// where there are exactly (steps + 1) elements in the array
// and each element is a color that fades between the two endpoint colors
export function colorRange(from: number, to: number, steps: number): number[] {
  const perStepFade = 1.0 / steps;
  const out = [];
  for (let i = 0; i < steps; i++) {
    out.push(colorLerp(from, to, perStepFade * i));
  }
  return out;
}

/**
 * Component wise lerp between colors
 */
export function colorLerp(from: number, to: number, percentTo: number): number {
  const rgbFrom = hexToRgb(from);
  const rgbTo = hexToRgb(to);

  rgbFrom.r = Math.floor(rgbFrom.r * (1.0 - percentTo));
  rgbFrom.g = Math.floor(rgbFrom.g * (1.0 - percentTo));
  rgbFrom.b = Math.floor(rgbFrom.b * (1.0 - percentTo));

  rgbTo.r = Math.floor(rgbTo.r * percentTo);
  rgbTo.g = Math.floor(rgbTo.g * percentTo);
  rgbTo.b = Math.floor(rgbTo.b * percentTo);

  return rgbToHex(rgbFrom) + rgbToHex(rgbTo);
}

/** Returns a new lighter color */
export function lighten(from: number, percent: number = 0.1): number {
  return colorLerp(from, 0xffffff, percent);
}

/** Returns a new darker color */
export function darken(from: number, percent: number = 0.1): number {
  return colorLerp(from, 0x000000, percent);
}

export function colorAdd(a: number, b: number): number {
  return rgbToHex(rgbAdd(hexToRgb(a), hexToRgb(b)));
}

export function rgbAdd(a: RGB, b: RGB): RGB {
  return {
    r: clamp(a.r + b.r, 0, 255),
    g: clamp(a.g + b.g, 0, 255),
    b: clamp(a.b + b.b, 0, 255),
  };
}

/**
 * Returns the maximum component distance between two colors
 * This probably isn't the most accurate color distance formula.
 * Consider using something better.
 */
export function colorDistance(c1: number, c2: number): number {
  const rgb1 = hexToRgb(c1);
  const rgb2 = hexToRgb(c2);

  return Math.max(
    Math.abs(rgb1.r - rgb2.r) / 255,
    Math.abs(rgb1.g - rgb2.g) / 255,
    Math.abs(rgb1.b - rgb2.b) / 255
  );
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * https://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
 */
export function hslToRgb({ h, s, l }: HSL): RGB {
  let r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    const hueTorgb = function hue2rgb(p: number, q: number, t: number) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hueTorgb(p, q, h + 1 / 3);
    g = hueTorgb(p, q, h);
    b = hueTorgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * https://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
 */
export function rgbToHsl({ r, g, b }: RGB): HSL {
  (r /= 255), (g /= 255), (b /= 255);
  var max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h: number;
  let s: number;
  let l: number = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        throw new Error("Unreachable");
    }
    h /= 6;
  }

  return { h, s, l };
}

/*
 * Assumes h, s, and v are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 * https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
 */
export function hsvToRgb({ h, s, v }: HSV): RGB {
  var r, g, b, i, f, p, q, t;
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0:
      (r = v), (g = t), (b = p);
      break;
    case 1:
      (r = q), (g = v), (b = p);
      break;
    case 2:
      (r = p), (g = v), (b = t);
      break;
    case 3:
      (r = p), (g = q), (b = v);
      break;
    case 4:
      (r = t), (g = p), (b = v);
      break;
    case 5:
      (r = v), (g = p), (b = q);
      break;
    default:
      throw new Error("unreachable");
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

/*
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and v in the set [0, 1].
 * https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
 */
export function rgbToHsv({ r, g, b }: RGB): HSV {
  var max = Math.max(r, g, b),
    min = Math.min(r, g, b),
    d = max - min,
    h,
    s = max === 0 ? 0 : d / max,
    v = max / 255;

  switch (max) {
    case min:
      h = 0;
      break;
    case r:
      h = g - b + d * (g < b ? 6 : 0);
      h /= 6 * d;
      break;
    case g:
      h = b - r + d * 2;
      h /= 6 * d;
      break;
    case b:
      h = r - g + d * 4;
      h /= 6 * d;
      break;
    default:
      throw new Error("unreachable");
  }

  return { h, s, v };
}
