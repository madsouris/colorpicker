<template>
  <div class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"> <!-- Darker overlay, added backdrop-blur -->
    <div class="bg-gradient-to-b from-slate-50 to-slate-200 p-6 sm:p-8 rounded-lg shadow-2xl text-center w-full max-w-md border border-slate-300"> <!-- Gradient, larger shadow, border -->
      <img src="/favicon.svg" alt="ColorPalette.Gen logo" class="mx-auto mb-4 w-24 h-24 rounded-full shadow" />
      <h2 class="text-3xl font-semibold text-slate-700 mb-3">Welcome to ColorPalette.Gen!</h2>
      <p class="text-slate-600 mb-8 text-sm sm:text-base">Use Regenerate button or space key on your keyboard to regenerate new palette. Check out color formula options too.</p>
      <button
        @click="$emit('start')"
        class="bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 active:from-blue-700 active:to-blue-800 text-white font-medium py-2.5 px-8 rounded-full shadow-md hover:shadow-lg active:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-all duration-150 ease-in-out cursor-pointer"
      > <!-- Glossy button style, now with rounded-full and cursor-pointer -->
        Start
      </button>
    </div>
  </div>
</template>

<script setup>
// No script logic needed for this simple version, emits are handled inline
// defineEmits(['start']); // You can explicitly define emits if preferred
</script>

<style scoped>
/* Scoped styles for the modal */
button {
  /* Adding a subtle text shadow for more depth on the button text */
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
}
</style>