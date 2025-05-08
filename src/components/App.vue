<template>
    <div id="color-v-app" class="p-6 sm:p-8">
        <WelcomeModal v-if="isWelcomeVisible" @start="handleStart" />
        <div v-else class="main-app-content">
            <h1 class="text-4xl font-semibold text-slate-700 text-center mb-6 tracking-tight">color.v</h1>

            <!-- Updated display for generated colors -->
            <div v-if="palette.length > 0" class="mt-8 border border-slate-300 rounded-md overflow-hidden">
                <!-- Added overflow-hidden for rounded corners on flex items -->
                <h2 class="text-xl font-medium text-slate-600 mb-0 p-4 bg-slate-100 border-b border-slate-300">Generated
                    Palette (Random - 5 Colors):</h2> <!-- Adjusted heading style -->
                <div class="flex flex-col sm:flex-row"> <!-- Changed to flex, sm:flex-row for responsiveness -->
                    <div v-for="(color, index) in palette" :key="index"
                        :style="{ backgroundColor: color.hex, color: getContrastingTextColor(color.hex) }"
                        class="flex-1 p-4 h-32 sm:h-48 flex flex-col justify-center items-center text-center relative">
                        <!-- Each color block takes equal space, text color dynamically set -->
                        <p class="font-mono font-bold text-sm">{{ color.hex }}</p>
                        <p class="font-mono text-xs">{{ color.rgb }}</p>
                    </div>
                </div>
                <div class="p-4 bg-slate-50 border-t border-slate-300 text-center"> <!-- Button container -->
                    <button @click="regeneratePalette"
                        class="bg-gradient-to-b from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-2 px-6 rounded-full shadow-md hover:shadow-lg cursor-pointer">
                        Regenerate
                    </button>
                </div>
            </div>
            <p v-else class="text-center text-slate-600">Click "Generate" to see a palette.</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'; // Added onUnmounted and watch
import WelcomeModal from './WelcomeModal.vue';
import { generatePalette, getContrastingTextColor } from '../logic/colorGenerator.js';

const isWelcomeVisible = ref(true);
const palette = ref([]);

const handleStart = () => {
    isWelcomeVisible.value = false;
    regeneratePalette();
};

const regeneratePalette = () => {
    palette.value = generatePalette('random');
    console.log('Generated Palette:', palette.value);
};

const handleKeyPress = (event) => {
    // Check if the welcome modal is hidden and the pressed key is Space
    if (!isWelcomeVisible.value && event.code === 'Space') {
        event.preventDefault(); // Prevent default spacebar action (e.g., scrolling)
        regeneratePalette();
    }
};

// Watch for changes in isWelcomeVisible to add/remove event listener
watch(isWelcomeVisible, (newValue) => {
    if (!newValue) { // If welcome modal is hidden, app is active
        window.addEventListener('keydown', handleKeyPress);
    } else { // If welcome modal is shown, app is inactive
        window.removeEventListener('keydown', handleKeyPress);
    }
});

// Cleanup the event listener when the component is unmounted
onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyPress);
});

</script>

<style scoped>
/* Styles for App.vue */
#color-v-app {
    /* ... */
}

/* Ensure borders between flex items if needed, or rely on background contrast */
/* For example, to add a subtle border between color blocks: */
/*
.flex > div:not(:last-child) {
  border-right: 1px solid rgba(0,0,0,0.1); 
}
sm: .flex-row > div:not(:last-child) {
    border-right: 1px solid rgba(0,0,0,0.1);
    border-bottom: none;
}
.flex-col > div:not(:last-child) {
    border-bottom: 1px solid rgba(0,0,0,0.1);
    border-right: none;
}
*/
</style>