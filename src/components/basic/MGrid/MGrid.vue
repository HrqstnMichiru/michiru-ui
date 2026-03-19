<template>
    <div
        class="m-grid"
        :style="{
            gap: Array.isArray(gap) ? `${gap[1]}px ${gap[0]}px` : `${gap}px`,
            gridTemplateColumns: templateColumns,
            placeItems: aligns
        }">
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
import { computed, provide, ref } from "vue";
import type { MGridContext, MGridProps } from "./types";
import { MGridContextKey } from "./types";

defineOptions({
    name: "MGrid"
});
const props = withDefaults(defineProps<MGridProps>(), {
    gap: 0,
    aligns: "stretch",
    cols: 24,
    minWidth: undefined,
    maxWidth: undefined
});

const autoLayout = computed(() => !!props.minWidth && props.minWidth > 0);
const templateColumns = computed(() => {
    if (!autoLayout.value) {
        return `repeat(${props.cols}, 1fr)`;
    }
    const minWidth = props.minWidth!;
    const maxWidth = !!props.maxWidth && props.maxWidth > 0 ? Math.max(props.maxWidth, minWidth) : null;
    const maxExpr = maxWidth ? `${maxWidth}px` : "1fr";
    return `repeat(auto-fill, minmax(${minWidth}px, ${maxExpr}))`;
});

const currentCol = ref(1); // 当前列起始位置
const register = (span: number, offset: number) => {
    if (autoLayout.value) return 1;
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

provide<MGridContext>(MGridContextKey, {
    register,
    get autoLayout() {
        return autoLayout.value;
    }
});
</script>

<style lang="scss" scoped>
.m-grid {
    display: grid;
}
</style>
