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
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <div class="flex flex-wrap gap-2 items-center">
                        <div class="flex flex-col">
                            <label for="baseColorInput" class="text-xs text-slate-600 mb-1">Starting point</label>
                            <input id="baseColorInput" type="color" v-model="baseHexColor"
                                class="form-input w-28 h-9 p-1 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent cursor-pointer" />
                        </div>
                        <select v-model="selectedFormula"
                            class="form-select px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm">
                            <option value="random">Random</option>
                            <option value="monochromatic" disabled>Monochromatic</option>
                            <option value="analogous" disabled>Analogous</option>
                            <option value="complementary" disabled>Complementary</option>
                            <option value="triadic" disabled>Triadic</option>
                        </select>
                        <button @click="regeneratePalette"
                            class="bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 active:from-blue-700 active:to-blue-800 text-white font-medium py-2 px-4 md:px-6 rounded-full shadow-md hover:shadow-lg active:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-all duration-150 ease-in-out cursor-pointer text-sm flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span class="hidden md:inline">Regenerate</span>
                        </button>
                    </div>
                    <div class="flex justify-start md:justify-end">
                        <button @click="downloadPalette"
                            class="bg-gradient-to-b from-zinc-50 to-zinc-100 hover:from-zinc-100 hover:to-zinc-200 active:from-zinc-200 active:to-zinc-300 text-zinc-800 font-medium py-2 px-4 md:px-6 rounded-full shadow-md hover:shadow-lg active:shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-opacity-75 transition-all duration-150 ease-in-out cursor-pointer text-sm flex items-center gap-2 border border-zinc-200">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <span class="hidden md:inline">Download JPG</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Palette Display Area -->
        <main class="flex-grow grid palette-grid overflow-hidden">
            <div v-if="palette.length > 0" v-for="(color, index) in palette" :key="index"
                :style="{ backgroundColor: color.hex, color: getContrastingTextColor(color.hex) }"
                class="flex flex-col justify-center items-center text-center p-4 relative">

                <p class="font-mono font-bold text-sm sm:text-base">{{ color.hex }}</p>
                <p class="font-mono text-xs sm:text-sm">{{ color.rgb }}</p>
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
import { generatePalette, getContrastingTextColor } from '../logic/colorGenerator.js';

const isWelcomeVisible = ref(true);
const palette = ref([]);
const baseHexColor = ref('');
const selectedFormula = ref('random');
const handleStart = () => {
    isWelcomeVisible.value = false;
};

const regeneratePalette = () => {
    palette.value = generatePalette(selectedFormula.value);

    if (palette.value.length > 0) {
        baseHexColor.value = palette.value[0].hex;
    }
};

watch(baseHexColor, (newValue) => {
    if (newValue && /^#[0-9A-F]{6}$/i.test(newValue)) {
        regeneratePalette();
    }
});

const downloadPalette = () => {
    alert('Download JPG functionality coming soon!');
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
    regeneratePalette();
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
</style>