// colorGenerator.js
// Core color utility functions

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

export function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

export function getContrastingTextColor(hexColor) {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return '#000000';
  const luminance = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return luminance >= 128 ? '#000000' : '#FFFFFF';
}

function generateRandomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return { r, g, b };
}

export function generatePalette(formula = "random", baseColorInput = null) {
  let colors = [];
  const totalColors = 5;

  // Use base color if provided, otherwise generate random
  let baseColor = baseColorInput || generateRandomColor();
  colors.push({
    hex: rgbToHex(baseColor.r, baseColor.g, baseColor.b),
    rgb: `rgb(${baseColor.r},${baseColor.g},${baseColor.b})`
  });

  // Generate remaining colors randomly
  for (let i = 1; i < totalColors; i++) {
    const color = generateRandomColor();
    colors.push({
      hex: rgbToHex(color.r, color.g, color.b),
      rgb: `rgb(${color.r},${color.g},${color.b})`
    });
  }

  return colors;
}