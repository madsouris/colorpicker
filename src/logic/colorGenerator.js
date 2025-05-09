// colorGenerator.js
// Core color utility functions

/**
 * Convert a hex color string to an RGB object.
 * @param {string} hex - Hex color string (e.g. '#ff00ff')
 * @returns {{r:number,g:number,b:number}|null} RGB object or null if invalid.
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

// Convert RGB to HSL
/**
 * Convert RGB values to HSL.
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {[number, number, number]} Array of [h, s, l] where h (0-360), s/l (0-100)
 */
export function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
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

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

// Convert HSL to RGB
export function hslToRgb(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return { 
    r: Math.round(r * 255), 
    g: Math.round(g * 255), 
    b: Math.round(b * 255) 
  };
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

export function generatePalette(formula = "random", baseColorInput = null, lockedColors = []) {
  let colors = [];
  const totalColors = 5;

  // Use base color if provided, otherwise generate random
  let baseColor = baseColorInput || generateRandomColor();
  
  // Convert base color to HSL for easier manipulation
  const baseHsl = rgbToHsl(baseColor.r, baseColor.g, baseColor.b);
  
  // Apply locked colors first
  for (let i = 0; i < totalColors; i++) {
    if (lockedColors[i]) {
      colors[i] = lockedColors[i];
    }
  }
  
  // Generate the first color if not locked
  if (!colors[0]) {
    colors[0] = {
      hex: rgbToHex(baseColor.r, baseColor.g, baseColor.b),
      rgb: `rgb(${baseColor.r},${baseColor.g},${baseColor.b})`,
      locked: false
    };
  }
  
  // Generate remaining colors based on formula
  for (let i = 1; i < totalColors; i++) {
    if (colors[i]) continue; // Skip locked colors
    
    let color;
    
    if (formula === "monochromatic") {
      // For monochromatic, vary the lightness while keeping hue and saturation
      const lightnessValues = [90, 70, 50, 30, 10]; // Different lightness values
      const newHsl = { 
        h: baseHsl.h, 
        s: baseHsl.s, 
        l: lightnessValues[i] 
      };
      
      const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
      color = newRgb;
    } else {
      // Random colors for other formulas
      color = generateRandomColor();
    }
    
    colors[i] = {
      hex: rgbToHex(color.r, color.g, color.b),
      rgb: `rgb(${color.r},${color.g},${color.b})`,
      locked: false
    };
  }
  
  return colors;
}

// Function to create SVG representation of the palette
export function createPaletteSvg(palette) {
  const width = 800;
  const height = 200;
  const colorWidth = width / palette.length;
  
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
  
  // Add color rectangles
  palette.forEach((color, index) => {
    const x = index * colorWidth;
    svg += `<rect x="${x}" y="0" width="${colorWidth}" height="${height}" fill="${color.hex}" />`;
    
    // Add color code text
    const textColor = getContrastingTextColor(color.hex);
    svg += `<text x="${x + colorWidth/2}" y="${height/2}" fill="${textColor}" text-anchor="middle" font-family="monospace" font-size="16">${color.hex}</text>`;
    svg += `<text x="${x + colorWidth/2}" y="${height/2 + 24}" fill="${textColor}" text-anchor="middle" font-family="monospace" font-size="12">${color.rgb}</text>`;
  });
  
  svg += '</svg>';
  return svg;
}