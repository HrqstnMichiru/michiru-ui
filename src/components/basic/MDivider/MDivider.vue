<template>
    <span
        class="m-divider"
        :class="[{ 'm-divider--vertical': vertical, 'm-divider--dashed': dashed }]"
        :style="{
            '--divider-thickness': `${thickness}px`,
            '--divider-color': color,
            '--divider-margin': margin,
            width: vertical ? undefined : `${length}px`,
            height: vertical ? `${length}px` : undefined
        }"></span>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import type { MDividerProps } from "./types";

defineOptions({
    name: "MDivider"
});
const props = withDefaults(defineProps<MDividerProps>(), {
    dashed: false,
    thickness: 1,
    color: "rgb(170, 170, 177)",
    margin: 0,
    vertical: false
});

const margin = computed(() => {
    if (props.vertical) {
        return `0px ${props.margin}px`;
    } else {
        return `${props.margin}px 0px`;
    }
});
</script>

<style lang="scss" scoped>
.m-divider {
    display: inline-block;
    border: none;
    width: 100%;
    height: 0;
    margin: var(--divider-margin);
    border-top: var(--divider-thickness) solid var(--divider-color);

    &.m-divider--vertical {
        width: 0;
        height: 100%;
        border-top: none;
        border-left: var(--divider-thickness) solid var(--divider-color);
    }

    &.m-divider--dashed {
        border-top-style: dashed;

        &.m-divider--vertical {
            border-top-style: none;
            border-left-style: dashed;
        }
    }
}
</style>
