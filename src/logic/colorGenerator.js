// colorGenerator.js
// This file will contain all the logic for generating color palettes.

/**
 * Converts a HEX color string to an RGB object.
 * @param {string} hex - The hex color string (e.g., "#RRGGBB" or "RRGGBB").
 * @returns {{r: number, g: number, b: number} | null} RGB object or null if invalid.
 */
export function hexToRgb(hex) {
  if (!hex) return null;
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Converts an RGB color object to a HEX string.
 * @param {number} r - Red value (0-255).
 * @param {number} g - Green value (0-255).
 * @param {number} b - Blue value (0-255).
 * @returns {string} HEX color string (e.g., "#RRGGBB").
 */
export function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

/**
 * Converts an RGB color object to an HSL object.
 * Assumes r, g, and b are contained in the set [0, 255] or [0, 1]
 * Returns h, s, and l in the set [0, 1].
 * @param   {number}  r       The red color value
 * @param   {number}  g       The green color value
 * @param   {number}  b       The blue color value
 * @return  {{h: number, s: number, l: number}}  The HSL representation
 */
export function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h, s, l };
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {{r: number, g: number, b: number}}  The RGB representation
 */
export function hslToRgb(h, s, l) {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

// Removed the first declaration of generateRandomHslColor and its JSDoc (previously lines 97-108)

/**
 * Calculates the perceived luminance of a color and returns a contrasting text color.
 * @param {string} hexColor - The background color in HEX format.
 * @returns {string} '#000000' for dark text on light background, '#FFFFFF' for light text on dark background.
 */
export function getContrastingTextColor(hexColor) {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return '#000000'; // Default to black if hex is invalid

  // Formula for perceived luminance (YIQ)
  const luminance = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;

  return luminance >= 128 ? '#000000' : '#FFFFFF'; // Threshold can be adjusted (0-255 range)
}

/**
 * Helper to adjust HSL values, ensuring they stay within bounds [0, 1].
 * @param {number} h - Hue.
 * @param {number} s - Saturation.
 * @param {number} l - Lightness.
 * @returns {{h: number, s: number, l: number}} Adjusted HSL object.
 */
function adjustHsl(h, s, l) {
    return {
        h: (h % 1 + 1) % 1, // Ensures h is [0, 1)
        s: Math.max(0, Math.min(1, s)),
        l: Math.max(0, Math.min(1, l)),
    };
}

/**
 * Generates a random HSL color object, suitable as a base for schemes.
 * @returns {{h: number, s: number, l: number}} Random HSL color.
 */
export function generateRandomHslColor() {
  const h = Math.random();         // Hue: 0 to 1
  const s = 0.6 + Math.random() * 0.4; // Saturation: 0.6 to 1.0 (reasonably vibrant)
  const l = 0.1 + Math.random() * 0.4; // Lightness: 0.1 to 0.5 (allows for darker colors)
  return { h, s, l };
}

/**
 * Generates a 5-color split-complementary palette from a base HSL color.
 * - 3 main contrasting colors.
 * - 2 lighter variations.
 * @param {{h: number, s: number, l: number}} baseHsl - The base HSL color.
 * @returns {Array<{hex: string, rgb: string}>} An array of 5 color objects.
 */
function generateSplitComplementaryPalette(baseHsl) {
  const hslColors = [];
  const baseS = baseHsl.s;
  const baseL = baseHsl.l;

  // 1. Base Color
  hslColors.push(adjustHsl(baseHsl.h, baseS, baseL));

  // Calculate complementary hue
  const complementaryHue = (baseHsl.h + 0.5) % 1.0;
  const splitOffset = 30 / 360; // 30 degrees offset for split

  // 2. First Split-Complementary Color
  const splitHue1 = (complementaryHue - splitOffset + 1.0) % 1.0;
  hslColors.push(adjustHsl(splitHue1, baseS, baseL));

  // 3. Second Split-Complementary Color
  const splitHue2 = (complementaryHue + splitOffset) % 1.0;
  hslColors.push(adjustHsl(splitHue2, baseS, baseL));

  // 4. Lighter version of the Base Color
  // Increase lightness, slightly decrease saturation for a softer feel.
  // Adjusted to be significantly lighter than the potentially darker base.
  hslColors.push(adjustHsl(baseHsl.h, baseS * 0.85, Math.min(0.92, baseL + 0.35)));

  // 5. Lighter version of the first Split-Complementary Color
  // Adjusted to be significantly lighter than the potentially darker base.
  hslColors.push(adjustHsl(splitHue1, baseS * 0.80, Math.min(0.94, baseL + 0.40)));
  
  // Convert HSL objects to the final {hex, rgb} format
  return hslColors.map(hsl => {
    const rgbColor = hslToRgb(hsl.h, hsl.s, hsl.l);
    return {
      hex: rgbToHex(rgbColor.r, rgbColor.g, rgbColor.b),
      rgb: `rgb(${rgbColor.r},${rgbColor.g},${rgbColor.b})`,
    };
  });
}

/**
 * Main function to generate a color palette.
 * @param {string} formula - The color theory formula to use.
 * @param {{r: number, g: number, b: number} | null} baseColorInput - Optional base RGB color.
 * @returns {Array<{hex: string, rgb: string}>} An array of color objects.
 */
export function generatePalette(formula = "random", baseColorInput = null) {
  console.log(`Generating palette with formula: ${formula}`, baseColorInput);
  
  let outputColors = [];

  if (formula === "random") {
    // For "random", generate a base HSL color if not provided, then create a split-complementary palette.
    const baseHsl = baseColorInput 
      ? rgbToHsl(baseColorInput.r, baseColorInput.g, baseColorInput.b) 
      : generateRandomHslColor();
    outputColors = generateSplitComplementaryPalette(baseHsl);
  } else {
    // Placeholder for other formulas - generates 5 grayscale colors
    // This part can be expanded to handle other specific formulas like "monochromatic", etc.
    const baseGrayLightness = 0.8; // Start with a light gray
    const step = 0.15; // Step down in lightness
    for (let i = 0; i < 5; i++) {
      const l = Math.max(0.1, baseGrayLightness - (i * step)); // Ensure lightness doesn't go too dark
      const grayHsl = { h: 0, s: 0, l: l }; // h and s are 0 for grayscale
      const rgbColor = hslToRgb(grayHsl.h, grayHsl.s, grayHsl.l);
      outputColors.push({
        hex: rgbToHex(rgbColor.r, rgbColor.g, rgbColor.b),
        rgb: `rgb(${rgbColor.r},${rgbColor.g},${rgbColor.b})`,
      });
    }
  }
  return outputColors;
}