<template>
    <div
        data-overlayscrollbars-initialize
        ref="scrollbarRef"
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
import { OverlayScrollbars } from "OverlayScrollbars";
import { onMounted, useTemplateRef } from "vue";
import type { MScrollBarProps } from "./types";

defineOptions({
    name: "MScrollBar"
});
const props = withDefaults(defineProps<MScrollBarProps>(), {
    scrollbar: "always",
    overflowX: "scroll",
    overflowY: "scroll"
});
const scrollbarRef = useTemplateRef<HTMLDivElement>("scrollbarRef");

onMounted(() => {
    if (scrollbarRef.value) {
        OverlayScrollbars(scrollbarRef.value, {
            scrollbars: {
                clickScroll: true,
                theme: "os-theme-dark",
                visibility: props.scrollbar === "always" ? "visible" : "hidden"
            },
            overflow: {
                x: props.overflowX,
                y: props.overflowY
            }
        });
    }
});
</script>

