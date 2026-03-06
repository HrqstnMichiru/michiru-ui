<template>
    <div
        class="m-grid-item"
        :style="{
            gridColumn: `${columnStart} / span ${span}`
        }">
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
import { inject, ref } from "vue";
import type { GridContext, GridItemProps } from "./types";
import { GridContextKey } from "./types";

defineOptions({
    name: "MGridItem"
});
const props = withDefaults(defineProps<GridItemProps>(), {
    span: 1,
    offset: 0
});
const gridContext = inject<GridContext | null>(GridContextKey, null);

const columnStart = ref<number>(1);
if (gridContext) {
    columnStart.value = gridContext.register(props.span, props.offset);
}
</script>

<style lang="scss" scoped>
.m-grid-item {
    min-width: 0;
}
</style>
