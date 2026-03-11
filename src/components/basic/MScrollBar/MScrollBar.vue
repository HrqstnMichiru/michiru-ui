<template>
    <div
        class="m-scroll-bar"
        :class="[`m-scroll-bar--${scrollbar}`]"
        :style="{
            maxHeight: `${maxHeight}px`,
            height: `${height}px`,
            width: `${width}px`,
            maxWidth: `${maxWidth}px`
        }"
        @scroll.stop>
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
import type { MScrollBarProps } from "./types";

defineOptions({
    name: "MScrollBar"
});
const props = withDefaults(defineProps<MScrollBarProps>(), {
    scrollbar: "always"
});
</script>

<style lang="scss" scoped>
.m-scroll-bar {
    position: relative;
    width: 100%;
    overflow: auto;
    &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }
    &::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 3px;
        &:hover {
            background-color: rgba(0, 0, 0, 0.3);
        }
    }
    &.m-scroll-bar--never {
        &::-webkit-scrollbar {
            width: 0;
            height: 0;
        }
        &::-webkit-scrollbar-thumb {
            background-color: transparent;
        }
    }
}
</style>
