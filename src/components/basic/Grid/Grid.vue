<template>
    <div
        class="m-grid"
        :style="{
            gap: Array.isArray(gap) ? `${gap[1]}px ${gap[0]}px` : `${gap}px`,
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            placeItems: aligns
        }">
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
import { provide, ref } from "vue";
import type { GridContext, GridProps } from "./types";
import { GridContextKey } from "./types";

defineOptions({
    name: "MGrid"
});
const props = withDefaults(defineProps<GridProps>(), {
    gap: 0,
    aligns: "stretch",
    cols: 24
});

const currentCol = ref(1); // 当前列起始位置
const register = (span: number, offset: number) => {
    const start = currentCol.value + offset;
    const end = start + span;
    // 检查是否需要换行
    if (end > props.cols + 1) {
        // 需要换行，从新行开始
        currentCol.value = 1 + offset;
        const newStart = currentCol.value;
        currentCol.value = newStart + span;
        return newStart;
    }
    // 更新下一个元素的起始位置
    currentCol.value = end;
    // 如果到达或超过下一行，重置到下一行开头
    if (currentCol.value >= props.cols + 1) {
        currentCol.value = 1;
    }
    return start;
};

provide<GridContext>(GridContextKey, {
    register
});
</script>

<style lang="scss" scoped>
.m-grid {
    display: grid;
}
</style>
