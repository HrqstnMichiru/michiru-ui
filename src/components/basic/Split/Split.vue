<template>
    <div ref="containerRef" class="m-split" :class="[`m-split--${direction}`, { 'm-split--disabled': disabled }]">
        <!-- 第一个面板 -->
        <div
            class="m-split__pane m-split__pane--first"
            :style="{
                '--first-size': firstSize
            }">
            <slot name="first"></slot>
        </div>
        <!-- 拖拽分割条 -->
        <div class="m-split__bar">
            <div class="m-split__gutter" :class="{ 'm-split__gutter--dragging': isDragging }" @mousedown.prevent="onGutterMouseDown"></div>
        </div>
        <!-- 第二个面板 -->
        <div class="m-split__pane m-split__pane--second">
            <slot name="second"></slot>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, ref, useTemplateRef } from "vue";
import type { SplitEmits, SplitProps } from "./types";

defineOptions({ name: "MSplit" });

const props = withDefaults(defineProps<SplitProps>(), {
    direction: "horizontal",
    size: "50%",
    min: "10%",
    max: "90%",
    disabled: false,
    gutterSize: 3
});

const emits = defineEmits<SplitEmits>();

const containerRef = useTemplateRef<HTMLDivElement>("containerRef");
const isDragging = ref<boolean>(false);
const firstSize = ref<string>(props.size);

// 将百分比或像素值转换为像素数值
const toPixels = (value: string, total: number): number => {
    const s = value.trim();
    if (s.endsWith("%")) return (parseFloat(s) / 100) * total;
    if (s.endsWith("px")) return parseFloat(s);
    return parseFloat(s);
};

// 将像素值格式化为百分比字符串（保留两位小数）
const toPct = (px: number, total: number): string => {
    return `${((px / total) * 100).toFixed(2)}%`;
};

// 拖拽逻辑
let startPos = 0;
let startSize = 0;
let totalSize = 0;

const onGutterMouseDown = (e: MouseEvent) => {
    if (props.disabled) return;
    const container = containerRef.value;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    totalSize = props.direction === "horizontal" ? rect.width : rect.height;
    startPos = props.direction === "horizontal" ? e.clientX : e.clientY;
    startSize = toPixels(firstSize.value, totalSize);

    isDragging.value = true;

    const currentValue = toPct(startSize, totalSize);
    emits("dragStart", currentValue);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
};

const onMouseMove = (e: MouseEvent) => {
    if (!isDragging.value) return;

    const currentPos = props.direction === "horizontal" ? e.clientX : e.clientY;
    const delta = currentPos - startPos;
    let newSize = startSize + delta;

    // 应用 min/max 约束
    const minPx = toPixels(props.min, totalSize);
    const maxPx = toPixels(props.max, totalSize);
    newSize = Math.max(minPx, Math.min(maxPx, newSize));

    const newValue = toPct(newSize, totalSize);
    firstSize.value = newValue;
    emits("dragging", newValue);
};

const onMouseUp = () => {
    if (!isDragging.value) return;
    isDragging.value = false;

    const container = containerRef.value;
    if (container) {
        const total = props.direction === "horizontal" ? container.getBoundingClientRect().width : container.getBoundingClientRect().height;
        const sizePx = toPixels(firstSize.value, total);
        emits("dragEnd", toPct(sizePx, total));
    }

    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
};

onBeforeUnmount(() => {
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
});
</script>

<style lang="scss" scoped>
.m-split {
    display: flex;
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    // 水平布局（左右）
    &.m-split--horizontal {
        flex-direction: row;
        .m-split__pane--first {
            height: 100%;
            width: var(--first-size);
        }
        .m-split__bar {
            width: 0px;
            height: 100%;
            cursor: ew-resize;
            .m-split__gutter {
                width: 16px;
                height: 100%;
                cursor: ew-resize;
                &::after {
                    cursor: ew-resize;
                    top: 0;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 3px;
                }
            }
        }
    }
    // 垂直布局（上下）
    &.m-split--vertical {
        flex-direction: column;
        .m-split__pane--first {
            width: 100%;
            height: var(--first-size);
        }
        .m-split__bar {
            width: 100%;
            height: 0px;
            cursor: ns-resize;
            .m-split__gutter {
                height: 16px;
                width: 100%;
                cursor: ns-resize;
                &::after {
                    cursor: ns-resize;
                    left: 0;
                    right: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    height: 3px;
                }
            }
        }
    }

    // ── 禁用状态
    &.m-split--disabled {
        .m-split__gutter {
            cursor: not-allowed !important;
            &::after {
                background-color: #e5e7eb !important;
                cursor: not-allowed !important ;
            }
        }
    }

    // 面板
    .m-split__pane {
        overflow: auto;
        min-width: 0;
        min-height: 0;
        &.m-split__pane--first {
            flex-shrink: 0;
        }
        &.m-split__pane--second {
            flex: 1;
        }
    }

    // 分割条
    .m-split__gutter {
        flex-shrink: 0;
        user-select: none;
        z-index: 1;
        position: relative;
        &::after {
            content: "";
            user-select: none;
            position: absolute;
            background-color: #e0e0e6;
            transition: background-color 0.2s var(--ease-in-out);
        }
        &:hover::after,
        .m-split__gutter--dragging:after {
            background-color: #801eff;
        }
    }
}
</style>
