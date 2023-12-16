export function stringToRandomHueHex(data: string): string {
  const randomHue = (stringToNumber(data) * 137.508) % 360; // 137.508 is an arbitrary constant

  const randomSaturation = 100;
  const randomLightness = 30;

  // Convert the HSL values to RGB
  const rgbColor = hslToRgb(randomHue, randomSaturation, randomLightness);

  // Convert the RGB color to a hex string
  const hexColor = rgbToHex(rgbColor);

  return hexColor;
}

function stringToNumber(str: string): number {
  // Simple hash function
  const hash: number = str
    .split('')
    .reduce((acc: number, char: string) => acc * 31 + char.charCodeAt(0), 0);

  // Convert the hash to a number
  const number: number = parseInt(hash.toString().slice(0, 10), 10); // Take the first 10 digits

  return number;
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h = h / 360;
  s = s / 100;
  l = l / 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hueToRgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hueToRgb(p, q, h + 1 / 3);
    g = hueToRgb(p, q, h);
    b = hueToRgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function rgbToHex(rgb: [number, number, number]): string {
  const [r, g, b] = rgb;
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}
