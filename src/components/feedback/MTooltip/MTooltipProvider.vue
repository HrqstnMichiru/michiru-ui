<template>
    <slot></slot>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, provide, shallowReactive } from "vue";
import type { MTooltipProviderContext, MTooltipProviderHandler } from "./types";
import { MTooltipProviderContextKey } from "./types";

// 维护一个 tooltip 实例树，记录每个 tooltip 的父级 tooltip（如果有的话）
const treeMap = shallowReactive<Map<string, MTooltipProviderHandler>>(new Map());

const register = (id: string, parentId: string | null, hide: () => void) => {
    treeMap.set(id, {
        parentId,
        hide
    });
};
const unregister = (id: string) => {
    treeMap.delete(id);
};
const isDescendant = (parentId: string, candidateId: string): boolean => {
    let current: string | null = candidateId;
    while (current) {
        if (current === parentId) return true;
        current = treeMap.get(current)?.parentId || null;
    }
    return false;
};
const hideParent = (id: string) => {
    let current: string | null = id;
    while (current) {
        const handler = treeMap.get(current);
        handler?.hide();
        current = handler?.parentId || null;
    }
};

provide<MTooltipProviderContext>(MTooltipProviderContextKey, {
    register,
    unregister,
    isDescendant,
    hideParent,
    parentId: null
});

onBeforeUnmount(() => {
    treeMap.clear();
});
</script>
