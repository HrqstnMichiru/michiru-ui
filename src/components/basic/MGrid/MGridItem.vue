<template>
    <div
        class="m-grid-item"
        :style="itemStyle">
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
import { computed, inject, ref } from "vue";
import type { MGridContext, MGridItemProps } from "./types";
import { MGridContextKey } from "./types";

defineOptions({
    name: "MGridItem"
});
const props = withDefaults(defineProps<MGridItemProps>(), {
    span: 1,
    offset: 0
});
const gridContext = inject<MGridContext>(MGridContextKey);

const columnStart = ref<number>(1);
if (gridContext) {
    if (!gridContext.autoLayout) {
        columnStart.value = gridContext.register(props.span, props.offset);
    }
}

const itemStyle = computed(() => {
    if (gridContext && gridContext.autoLayout) {
        return {};
    }
    return {
        gridColumn: `${columnStart.value} / span ${props.span}`
    };
});
</script>

<style lang="scss" scoped>
.m-grid-item {
    min-width: 0;
}
</style>
