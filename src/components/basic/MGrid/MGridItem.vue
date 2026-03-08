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
import type { MGridContext, MGridItemProps } from "./types";
import { MGridContextKey } from "./types";

defineOptions({
    name: "MGridItem"
});
const props = withDefaults(defineProps<MGridItemProps>(), {
    span: 1,
    offset: 0
});
const gridContext = inject<MGridContext | null>(MGridContextKey, null);

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
