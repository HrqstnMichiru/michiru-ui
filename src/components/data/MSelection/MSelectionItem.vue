<template>
    <slot :active="active" :data="data" :toggle="toggle" :select="select" :unselect="unselect"></slot>
</template>

<script lang="ts" setup generic="T extends Record<string, any>">
import { computed, inject, onBeforeMount, onBeforeUnmount } from "vue";
import type { MSelectionContext, MSelectionItemProps } from "./types";
import { MSelectionContextKey } from "./types";

defineOptions({
    name: "MSelectionItem"
});
defineSlots<{
    default?: (props: { active: boolean; data: T; toggle: () => void; select: () => void; unselect: () => void }) => any;
}>();
const props = defineProps<MSelectionItemProps<T>>();
const context = inject<MSelectionContext>(MSelectionContextKey);
if (!context) {
    throw new Error("MSelectionItem must be used within MSelection.");
}

const currentValue = computed<string | number>(() => {
    return props.data[context.itemKey] as string | number;
});

onBeforeMount(() => {
    context.register(currentValue.value);
});

onBeforeUnmount(() => {
    context.unregister(currentValue.value);
});

const active = computed<boolean>(() => {
    return context.isSelected(currentValue.value);
});

const toggle = () => {
    context.setSelected(currentValue.value);
};

const select = () => {
    if (active.value) return;
    context.setSelected(currentValue.value);
};

const unselect = () => {
    if (!active.value) return;
    context.setSelected(currentValue.value);
};
</script>
