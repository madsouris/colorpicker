<template>
    <div id="color-v-app" class="flex flex-col min-h-screen bg-slate-100">
        <WelcomeModal v-if="isWelcomeVisible" @start="handleStart" />

        <!-- Title Bar -->
        <header class="py-3 border-b border-slate-300 bg-white shadow-sm">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-2 items-center">
                    <div>
                        <h1 class="text-2xl font-semibold text-slate-700 tracking-tight">
                            ColorPalette.Gen
                        </h1>
                        <p class="text-xs text-slate-700 tracking-tight">
                            by vannrith.com
                        </p>
                    </div>
                    <div class="text-right">
                        <div class="inline-block bg-slate-200 px-4 py-2 text-xs text-slate-500 rounded">
                            Ads Space
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <!-- Control Bar -->
        <nav class="py-4 border-b border-slate-300 bg-slate-50">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                    <div class="flex flex-wrap gap-2 items-end">
                        <!-- Starting point input removed for simpler UX -->
                        <div class="flex flex-col">
                            <label for="formulaSelect" class="text-xs text-slate-600 mb-1">Color formula</label>
                            <select id="formulaSelect" v-model="selectedFormula"
                                class="form-select px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm">
                                <option value="random">Random</option>
                                <option value="monochromatic">Monochromatic</option>
                                <option value="analogous">Analogous</option>
                                <option value="complementary">Complementary</option>
                                <option value="triadic">Triadic</option>
                            </select>
                        </div>
                        <button @click="regeneratePalette()"
                            class="bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 active:from-blue-700 active:to-blue-800 text-white font-medium py-2 px-4 md:px-6 rounded-full shadow-md hover:shadow-lg active:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-all duration-150 ease-in-out cursor-pointer text-sm flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span class="hidden md:inline">Regenerate</span>
                        </button>
                    </div>
                    <div class="flex justify-start md:justify-end items-end">
                        <button @click="downloadPalette"
                            class="bg-gradient-to-b from-zinc-50 to-zinc-100 hover:from-zinc-100 hover:to-zinc-200 active:from-zinc-200 active:to-zinc-300 text-zinc-800 font-medium py-2 px-4 md:px-6 rounded-full shadow-md hover:shadow-lg active:shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-opacity-75 transition-all duration-150 ease-in-out cursor-pointer text-sm flex items-center gap-2 border border-zinc-200">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <span class="hidden md:inline">Download SVG</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Palette Display Area -->
        <main class="flex-grow grid palette-grid overflow-hidden">
            <div v-if="palette.length > 0" v-for="(color, index) in palette" :key="index"
                :style="{ backgroundColor: color.hex, color: getContrastingTextColor(color.hex) }"
                class="flex flex-row md:flex-col gap-8 justify-between items-center md:justify-center md:items-center text-center p-4 relative cursor-pointer hover:opacity-90">

                <!-- Color Codes -->
                <div class=" flex flex-col gap-2 text-left md:text-center items-start md:items-center">
                    <p @click="(event) => copyToClipboard(color.hex, event)"
                        class="font-mono font-bold text-sm sm:text-base lg:text-3xl cursor-pointer uppercase ">
                        {{ color.hex }}
                    </p>
                    <p @click="(event) => copyToClipboard(color.rgb, event)"
                        class="font-mono text-xs sm:text-sm cursor-pointer uppercase">
                        {{ color.rgb }}
                    </p>
                </div>

                <!-- Lock/Unlock Button -->
                <button @click="toggleLock(index)"
                    class="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors cursor-pointer">
                    <svg v-if="color.locked" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    </svg>
                </button>
            </div>
            <div v-else class="col-span-full flex items-center justify-center text-slate-600 p-10">
                <p>Generating your palette...</p>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import WelcomeModal from './WelcomeModal.vue';
import { generatePalette, getContrastingTextColor, createPaletteSvg, hexToRgb } from '../logic/colorGenerator.js';

const isWelcomeVisible = ref(true);
const palette = ref([]);
// Default to 'random' formula
const selectedFormula = ref('random');
const handleStart = () => {
    isWelcomeVisible.value = false;
};

function getRandomHexColor() {
    const hex = '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
    return hex;
}

/**
 * Regenerate the color palette based on the selected formula.
 * If 'Random' is selected, randomly pick a real formula each time.
 * Preserves locked colors and fills unlocked slots with new colors.
 */
const regeneratePalette = () => {
    // Collect locked colors for all formulas
    const lockedColors = palette.value.map(color => color && color.locked ? color : null);
    // List of real formulas
    const realFormulas = ['monochromatic', 'analogous', 'complementary', 'triadic'];
    let formula = selectedFormula.value;
    if (formula === 'random') {
        // Pick one randomly
        formula = realFormulas[Math.floor(Math.random() * realFormulas.length)];
    }
    if (formula === 'analogous') {
        palette.value = generateAnalogousPalette(getRandomHexColor(), 5, lockedColors);
    } else if (formula === 'complementary') {
        palette.value = generateComplementaryPalette(getRandomHexColor(), 5, lockedColors);
    } else if (formula === 'triadic') {
        palette.value = generateTriadicPalette(getRandomHexColor(), 5, lockedColors);
    } else {
        palette.value = generatePalette(formula, null, lockedColors);
    }
};

// Generate analogous palette
/**
 * Generate an analogous color palette (colors next to each other on the color wheel).
 * @param {string} hex - Base hex color.
 * @param {number} count - Number of colors in palette.
 * @param {Array} lockedColors - Array of locked color objects or nulls.
 * @returns {Array} Array of color objects.
 */
function generateAnalogousPalette(hex, count = 5, lockedColors = []) {
    // Convert hex to HSL
    const hsl = hexToHSL(hex);
    const colors = [];
    // Center color
    const center = Math.floor(count / 2);
    for (let i = 0; i < count; i++) {
        if (lockedColors && lockedColors[i]) {
            colors.push(lockedColors[i]);
        } else {
            const offset = (i - center) * 30; // 30 degree step
            let hue = (hsl.h + offset + 360) % 360;
            const colorHex = hslToHex(hue, hsl.s, hsl.l);
            const rgbObj = hexToRgb(colorHex);
            const rgbStr = rgbObj ? `rgb(${rgbObj.r},${rgbObj.g},${rgbObj.b})` : '';
            colors.push({
                hex: colorHex,
                rgb: rgbStr,
                hsl: { h: hue, s: hsl.s, l: hsl.l },
                locked: false
            });
        }
    }
    return colors;
}

// Generate triadic palette
/**
 * Generate a triadic color palette (three colors 120° apart).
 * @param {string} hex - Base hex color.
 * @param {number} count - Number of colors in palette.
 * @param {Array} lockedColors - Array of locked color objects or nulls.
 * @returns {Array} Array of color objects.
 */
function generateTriadicPalette(hex, count = 5, lockedColors = []) {
    const hsl = hexToHSL(hex);
    const triad1 = hsl.h;
    const triad2 = (hsl.h + 120) % 360;
    const triad3 = (hsl.h + 240) % 360;
    const colors = [];
    // We'll use base color, two triad colors, and tints/shades for the rest
    // Place base at center, triad2 and triad3 at left/right, rest are tints/shades
    // Example order: [tint, triad2, base, triad3, shade]
    const slots = [0, 1, 2, 3, 4];
    const baseIdx = 2;
    const triad2Idx = 1;
    const triad3Idx = 3;
    for (let i = 0; i < count; i++) {
        if (lockedColors && lockedColors[i]) {
            colors.push(lockedColors[i]);
        } else if (i === baseIdx) {
            const colorHex = hslToHex(triad1, hsl.s, hsl.l);
            const rgbObj = hexToRgb(colorHex);
            const rgbStr = rgbObj ? `rgb(${rgbObj.r},${rgbObj.g},${rgbObj.b})` : '';
            colors.push({ hex: colorHex, rgb: rgbStr, hsl: { h: triad1, s: hsl.s, l: hsl.l }, locked: false });
        } else if (i === triad2Idx) {
            const colorHex = hslToHex(triad2, hsl.s, hsl.l);
            const rgbObj = hexToRgb(colorHex);
            const rgbStr = rgbObj ? `rgb(${rgbObj.r},${rgbObj.g},${rgbObj.b})` : '';
            colors.push({ hex: colorHex, rgb: rgbStr, hsl: { h: triad2, s: hsl.s, l: hsl.l }, locked: false });
        } else if (i === triad3Idx) {
            const colorHex = hslToHex(triad3, hsl.s, hsl.l);
            const rgbObj = hexToRgb(colorHex);
            const rgbStr = rgbObj ? `rgb(${rgbObj.r},${rgbObj.g},${rgbObj.b})` : '';
            colors.push({ hex: colorHex, rgb: rgbStr, hsl: { h: triad3, s: hsl.s, l: hsl.l }, locked: false });
        } else {
            // Fill with tints and shades of base
            let lMod = (i < baseIdx) ? 15 * (baseIdx - i) : -15 * (i - baseIdx);
            let useL = Math.max(0, Math.min(100, hsl.l + lMod));
            const colorHex = hslToHex(triad1, hsl.s, useL);
            const rgbObj = hexToRgb(colorHex);
            const rgbStr = rgbObj ? `rgb(${rgbObj.r},${rgbObj.g},${rgbObj.b})` : '';
            colors.push({ hex: colorHex, rgb: rgbStr, hsl: { h: triad1, s: hsl.s, l: useL }, locked: false });
        }
    }
    return colors;
}

// Generate complementary palette
/**
 * Generate a complementary color palette (base + opposite on color wheel).
 * @param {string} hex - Base hex color.
 * @param {number} count - Number of colors in palette.
 * @param {Array} lockedColors - Array of locked color objects or nulls.
 * @returns {Array} Array of color objects.
 */
function generateComplementaryPalette(hex, count = 5, lockedColors = []) {
    const hsl = hexToHSL(hex);
    const compHue = (hsl.h + 180) % 360;
    const colors = [];
    // We'll use base color, complementary, and tints/shades for the rest
    // Place base at center, complementary at next slot, rest are tints/shades
    const slots = [0, 1, 2, 3, 4];
    const baseIdx = 2; // center
    const compIdx = 3; // next to center
    for (let i = 0; i < count; i++) {
        if (lockedColors && lockedColors[i]) {
            colors.push(lockedColors[i]);
        } else if (i === baseIdx) {
            const colorHex = hslToHex(hsl.h, hsl.s, hsl.l);
            const rgbObj = hexToRgb(colorHex);
            const rgbStr = rgbObj ? `rgb(${rgbObj.r},${rgbObj.g},${rgbObj.b})` : '';
            colors.push({ hex: colorHex, rgb: rgbStr, hsl: { ...hsl }, locked: false });
        } else if (i === compIdx) {
            const colorHex = hslToHex(compHue, hsl.s, hsl.l);
            const rgbObj = hexToRgb(colorHex);
            const rgbStr = rgbObj ? `rgb(${rgbObj.r},${rgbObj.g},${rgbObj.b})` : '';
            colors.push({ hex: colorHex, rgb: rgbStr, hsl: { h: compHue, s: hsl.s, l: hsl.l }, locked: false });
        } else {
            // Fill with tints and shades of base and complementary
            // For simplicity, alternate lighter/darker versions
            let lMod = 0;
            if (i < baseIdx) lMod = 15 * (baseIdx - i); // lighter
            else if (i > compIdx) lMod = -15 * (i - compIdx); // darker
            let useHue = (i < baseIdx) ? hsl.h : compHue;
            let useL = Math.max(0, Math.min(100, hsl.l + lMod));
            const colorHex = hslToHex(useHue, hsl.s, useL);
            const rgbObj = hexToRgb(colorHex);
            const rgbStr = rgbObj ? `rgb(${rgbObj.r},${rgbObj.g},${rgbObj.b})` : '';
            colors.push({ hex: colorHex, rgb: rgbStr, hsl: { h: useHue, s: hsl.s, l: useL }, locked: false });
        }
    }
    return colors;
}

// Helpers: hexToHSL and hslToHex
function hexToHSL(H) {
    // Convert hex to RGB first
    let r = 0, g = 0, b = 0;
    if (H.length == 4) {
        r = "0x" + H[1] + H[1];
        g = "0x" + H[2] + H[2];
        b = "0x" + H[3] + H[3];
    } else if (H.length == 7) {
        r = "0x" + H[1] + H[2];
        g = "0x" + H[3] + H[4];
        b = "0x" + H[5] + H[6];
    }
    r /= 255;
    g /= 255;
    b /= 255;
    const cmin = Math.min(r,g,b), cmax = Math.max(r,g,b), delta = cmax - cmin;
    let h = 0, s = 0, l = 0;
    if (delta === 0)
        h = 0;
    else if (cmax === r)
        h = ((g - b) / delta) % 6;
    else if (cmax === g)
        h = (b - r) / delta + 2;
    else
        h = (r - g) / delta + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
    l = (cmax + cmin) / 2;
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
    return { h, s, l };
}

function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;
    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c/2,
        r = 0, g = 0, b = 0;
    if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

const toggleLock = (index) => {
    if (palette.value[index]) {
        palette.value[index].locked = !palette.value[index].locked;
    }
};

// Track original text values for elements being copied
const originalTexts = ref({});

const copyToClipboard = (text, event) => {
    // Get the element that was clicked
    const element = event.currentTarget;
    const isHex = text.startsWith('#');
    const feedbackText = isHex ? 'HEX copied!' : 'RGB copied!';

    // Store the original text if not already stored
    if (!originalTexts.value[text]) {
        originalTexts.value[text] = element.textContent.trim();
    }

    // Update the element text to show feedback
    element.textContent = feedbackText;

    // Copy to clipboard
    navigator.clipboard.writeText(text)
        .then(() => {
            console.log('Copied to clipboard:', text);

            // Revert back to original text after 1 second
            setTimeout(() => {
                element.textContent = originalTexts.value[text];
            }, 1000);
        })
        .catch(err => {
            console.error('Failed to copy:', err);
            // Revert back immediately on error
            element.textContent = originalTexts.value[text];
        });
};

// Base color watch removed as we no longer have a base color input

const downloadPalette = () => {
    // Create SVG content
    const svgContent = createPaletteSvg(palette.value);

    // Create a Blob with the SVG content
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = 'color-palette.svg';
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

const handleKeyPress = (event) => {
    if (!isWelcomeVisible.value && event.code === 'Space' && event.target.tagName !== 'INPUT' && event.target.tagName !== 'SELECT') {
        event.preventDefault();
        regeneratePalette();
    }
};

watch(isWelcomeVisible, (newValue) => {
    if (!newValue) {
        window.addEventListener('keydown', handleKeyPress);
    } else {
        window.removeEventListener('keydown', handleKeyPress);
    }
});

onMounted(() => {
    regeneratePalette(); // Generate initial random palette
    if (!isWelcomeVisible.value) {
        window.addEventListener('keydown', handleKeyPress);
    }
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyPress);
});

</script>

<style scoped>
:global(html),
:global(body),
:global(#app) {
    height: 100%;
    margin: 0;
}

:global(#color-v-app) {
    min-height: 100vh;
}

#color-v-app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f8fafc;
}

header,
nav {
    flex-shrink: 0;
}

main.palette-grid {
    flex-grow: 1;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(5, 1fr);
}

@media (min-width: 640px) {
    main.palette-grid {
        grid-template-columns: repeat(5, 1fr);
        grid-template-rows: 1fr;
    }
}

.form-input,
.form-select {
    transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
}

.form-input:focus,
.form-select:focus {
    border-color: #60a5fa;
    box-shadow: 0 0 0 0.2rem rgba(96, 165, 250, 0.25);
}

/* Copy tooltip styles */
.copy-tooltip {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    pointer-events: none;
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.2s, transform 0.2s;
    z-index: 10;
    white-space: nowrap;
    left: 50%;
    transform: translateX(-50%);
    bottom: -20px;
}

p:hover .copy-tooltip {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
}

/* Lock button hover effect */
button.absolute {
    transition: all 0.2s ease;
}

button.absolute:hover {
    transform: scale(1.1);
}
</style>