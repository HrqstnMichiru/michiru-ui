<template>
    <div
        class="m-scroll-bar"
        ref="wrapper"
        :style="{
            '--scrollbar-thumb-color': thumbColor,
            '--scrollbar-width': '5px',
            '--scrollbar-opacity': scrollbar === 'never' ? '0' : '1',
            maxHeight: `${maxHeight}px`,
            height: `${height}px`,
            width: `${width}px`,
            maxWidth: `${maxWidth}px`
        }">
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
import Scrollbar from "smooth-scrollbar";
import { onBeforeUnmount, onMounted, useTemplateRef } from "vue";
import type { ScrollBarProps } from "./types";

defineOptions({
    name: "MScrollArea"
});
const props = withDefaults(defineProps<ScrollBarProps>(), {
    thumbColor: "rgba(0, 0, 0, 0.2)",
    scrollbar: "auto"
});

const wrapper = useTemplateRef<HTMLDivElement>("wrapper");
let scrollbarInstance: Scrollbar | null = null;
let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
    if (wrapper.value) {
        scrollbarInstance = Scrollbar.init(wrapper.value, {
            damping: 0.08, // 阻尼越小越平滑
            alwaysShowTracks: props.scrollbar === "always",
            renderByPixels: true,
            continuousScrolling: false
        });

        // 监听内容高度变化，自动更新滚动条
        resizeObserver = new ResizeObserver(() => {
            if (scrollbarInstance) {
                scrollbarInstance.update();
            }
        });
        resizeObserver.observe(wrapper.value);
    }
});

onBeforeUnmount(() => {
    if (resizeObserver) {
        resizeObserver.disconnect();
    }
    if (scrollbarInstance) {
        scrollbarInstance.destroy();
    }
});
</script>

<style lang="scss" scoped>
.m-scroll-bar {
    position: relative;
    width: 100%;
    overflow: hidden;
    &::-webkit-scrollbar {
        display: none;
        width: 0 !important;
        height: 0 !important;
    }
    :deep(.scroll-content) {
        width: 100%;
    }
    :deep(.scrollbar-track-y) {
        width: var(--scrollbar-width);
        opacity: var(--scrollbar-opacity);
        .scrollbar-thumb-y {
            width: var(--scrollbar-width);
            background-color: var(--scrollbar-thumb-color);
        }
    }
}
</style>
