# What is it?

"color.v" (color.vannrith.com) is a web app to help designers generator color palettes. It's free, not behind auth and run entirely on the web browser.

# Key features

Color.v offers generation based on color theory formula:

- Monochromatic
- Analogous
- Complementary
- Split-complementary
- Triadic
- Teradic

The generated palette will offer good contrast and synergy so the designer can just click to copy the HEX or RGB code to use it straight away, optionally the app will provide a download button to download the generated color palette in JPG format.

# How does it work

The app starts with a welcome popup with the "start" button. Once started, the user has to pick a formula, random is the default, and hit generate or space key. The user will get 6 colors in the palette below with the color preview, HEX and RGB code, click on each code will copy the code or download the whole palette in JPG format.

Key things to note:

- It will always generate 6 colors each time
- If the formula is Monochromatic, it should generate 6 colors in the same family color but different light or dark value and ordered by dark to light.
- If the formula is Complementary, it should generate 6 colors, for example 3 of them are in Red family and other 3 are in Green family
- Same principle for any other formula
- If Random formula is selected, generate 6 colors that would go well together, HSL, Contrast etc. And keep regenerating different colors each time the user press generate button

# Tech stack

- Vue Js for front end
- Plain Javascript for logic
- TailwindCSS for styling

# Technical Approach & Implementation Details

This section outlines the proposed technical architecture and implementation strategy for "color.v".

## Project Setup (Astro + Vue + TailwindCSS)

The project will be built using Astro for the overall site structure and static generation, with Vue.js for interactive UI components and TailwindCSS for styling.

*   **Initialize Astro Project:** Ensure Astro is configured.
*   **Add Vue Integration to Astro:** Use `npx astro add vue`.
*   **Add TailwindCSS to Astro:** Use `npx astro add tailwind`.
*   **Proposed Directory Structure:**
    ```
    /
    ├── public/
    │   └── (static assets like favicon)
    ├── src/
    │   ├── components/  (Vue components)
    │   │   ├── WelcomeModal.vue
    │   │   ├── Controls.vue
    │   │   ├── PaletteDisplay.vue
    │   │   ├── ColorCard.vue
    │   │   └── DownloadButton.vue
    │   ├── logic/
    │   │   └── colorGenerator.js (Plain JavaScript for all color calculations)
    │   ├── layouts/
    │   │   └── Layout.astro (Main page layout)
    │   └── pages/
    │       └── index.astro (Main page, will import Vue components)
    ├── astro.config.mjs
    ├── tailwind.config.cjs
    └── package.json
    ```

## Vue Component Breakdown

*   **`App.vue` (or main Vue component within `index.astro`):** Manages overall application state (welcome modal, selected formula, generated colors) and orchestrates child components.
*   **`WelcomeModal.vue`:** Displays the initial welcome message and "Start" button. Emits an event to start the app.
*   **`Controls.vue`:** Contains the formula selector and "Generate" button. Emits events for formula changes and generation requests.
*   **`PaletteDisplay.vue`:** Receives the array of 6 color objects and renders `ColorCard.vue` components.
*   **`ColorCard.vue`:** Displays a single color's preview, HEX, and RGB codes. Handles click-to-copy.
*   **`DownloadButton.vue`:** Receives the current palette and handles JPG download.

## Color Generation Logic (`src/logic/colorGenerator.js`)

This plain JavaScript module will house all color calculation logic.

*   **Color Representation:** HSL (Hue, Saturation, Lightness) will be used internally for easier manipulation.
*   **Core Utility Functions:**
    *   `hexToRgb(hex)`, `rgbToHex(r, g, b)`
    *   `rgbToHsl(r, g, b)`, `hslToRgb(h, s, l)`
    *   `generateRandomHslColor()`
    *   Functions to adjust lightness, saturation, and hue.
*   **Palette Generation Functions:**
    *   `generateMonochromaticPalette(baseHsl)`
    *   `generateAnalogousPalette(baseHsl)`
    *   `generateComplementaryPalette(baseHsl)`
    *   `generateSplitComplementaryPalette(baseHsl)`
    *   `generateTriadicPalette(baseHsl)`
    *   `generateTetradicPalette(baseHsl)`
    *   `generateRandomHarmoniousPalette()`: A more complex function aiming for aesthetically pleasing random combinations.
*   **Main Function:** `generatePalette(formula, baseColor = null)` to dispatch to the correct specific generator.

## State Management (Vue)

Vue's `ref` and `reactive` will be used for managing UI state within components, such as:
*   `isWelcomeVisible`
*   `selectedFormula`
*   `colorPalette` (array of 6 color objects)

## Styling with TailwindCSS

Tailwind utility classes will be applied directly in Vue components and Astro files for a clean, minimalist design.

## Implementing Key Features

*   **Welcome Popup:** Conditional rendering in Vue.
*   **Formula Selection & Generation:** UI controls update state, triggering `colorGenerator.js`.
*   **Palette Display:** `v-for` in Vue to render color cards.
*   **Click to Copy:** `navigator.clipboard.writeText()` in `ColorCard.vue`.
*   **Space Key to Generate:** Global keydown listener.
*   **Download as JPG:**
    1.  Create a hidden `<canvas>`.
    2.  Draw color rectangles onto the canvas.
    3.  Optionally, draw text (HEX/RGB codes).
    4.  Convert canvas to JPG: `canvas.toDataURL('image/jpeg')`.
    5.  Trigger download via a temporary `<a>` element.
    6.  Alternatively, use a library like `html2canvas` for more complex DOM-to-image capture.

# Development Steps Suggestion

1.  **Setup & Basic UI Shell:** Initialize Astro, Vue, Tailwind. Create basic layout and components, including the welcome modal.
2.  **Core Color Logic:** Develop `colorGenerator.js`, starting with conversions and a simple formula (e.g., Monochromatic). Test independently.
3.  **Integrate Logic & Display:** Connect UI controls to `colorGenerator.js`. Display results in `PaletteDisplay.vue` and `ColorCard.vue`.
4.  **Implement Copy Functionality.**
5.  **Implement JPG Download.**
6.  **Implement Remaining Formulas & Random Generation.**
7.  **Refine & Polish:** Add spacebar functionality, improve styling, test thoroughly, and handle edge cases.