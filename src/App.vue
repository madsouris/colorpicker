<template>
    <ColorComponent />
</template>

<script lang="ts">
    import ColorComponent from "./components/color.vue";
    import { defineComponent } from "vue";

    export default defineComponent({
        components: {
            ColorComponent,
        },
    });
</script>

<style scoped></style>
