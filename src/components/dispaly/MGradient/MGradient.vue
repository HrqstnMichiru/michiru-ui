<template>
    <span
        class="text-gradient"
        :style="{
            backgroundImage: gradientStyle
        }">
        <slot>{{ content }}</slot>
    </span>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import type { MGradientProps } from "./types";

defineOptions({
    name: "MTextGradient"
});
const props = withDefaults(defineProps<MGradientProps>(), {
    colors: () => ["#667eea 20%", "#764ba2 50%", "#6b8dd6 80%"],
    direction: "horizontal"
});

const gradientStyle = computed(() => {
    const colorStops = props.colors.join(", ");

    if (props.angle !== undefined) {
        return `linear-gradient(${props.angle}deg, ${colorStops})`;
    }

    switch (props.direction) {
        case "vertical":
            return `linear-gradient(180deg, ${colorStops})`;
        case "diagonal":
            return `linear-gradient(135deg, ${colorStops})`;
        case "horizontal":
        default:
            return `linear-gradient(90deg, ${colorStops})`;
    }
});
</script>

<style lang="scss" scoped>
.text-gradient {
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
    display: inline-block;
    font-weight: 500;
}
</style>
