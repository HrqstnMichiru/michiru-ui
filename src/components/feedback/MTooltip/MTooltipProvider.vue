<template>
    <slot></slot>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, provide, shallowReactive } from "vue";
import { MTooltipProviderContextKey, type MTooltipProviderContext } from "./types";

const treeMap = shallowReactive<Map<string, string | null>>(new Map());

const register = (id: string, parentId: string | null) => {
    treeMap.set(id, parentId);
};
const unregister = (id: string) => {
    treeMap.delete(id);
};
const isDescendant = (parentId: string, candidateId: string): boolean => {
    let current: string | null = candidateId;
    while (current) {
        if (current === parentId) return true;
        current = treeMap.get(current) || null;
    }
    return false;
};

provide<MTooltipProviderContext>(MTooltipProviderContextKey, {
    register,
    unregister,
    isDescendant,
    parentId: null
});

onBeforeUnmount(() => {
    treeMap.clear();
});
</script>
