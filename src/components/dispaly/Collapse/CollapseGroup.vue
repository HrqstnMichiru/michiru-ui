<template>
    <div class="m-collapse-group">
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, provide, shallowReactive } from "vue";
import type { CollapseGroupContext, CollapseGroupInstance, CollapseGroupProps } from "./types";
import { CollapseGroupContextKey } from "./types";

defineOptions({
    name: "MCollapseGroup"
});
const props = withDefaults(defineProps<CollapseGroupProps>(), {
    duration: 300,
    accordion: false,
    expanded: false,
    defaultActive: (): Array<number | string> => []
});
const collapseSet = shallowReactive<Set<string | number>>(new Set());
const activeNameSet = shallowReactive<Set<string | number>>(new Set());

const register = (name: string | number) => {
    collapseSet.add(name);
};
const toggle = (name: string | number) => {
    if (props.accordion) {
        collapseSet.forEach(otherName => {
            if (otherName == name) return;
            activeNameSet.delete(otherName);
        });
    }
    if (activeNameSet.has(name)) {
        activeNameSet.delete(name);
    } else {
        activeNameSet.add(name);
    }
};
const isActive = (name: string | number) => {
    return activeNameSet.has(name);
};
const toggleAll = (expand: boolean) => {
    if (!expand) {
        activeNameSet.clear();
    } else {
        if (props.accordion) return;
        collapseSet.forEach(name => {
            activeNameSet.add(name);
        });
    }
};
const expandAll = () => {
    toggleAll(true);
};
const collapseAll = () => {
    toggleAll(false);
};

provide<CollapseGroupContext>(CollapseGroupContextKey, {
    duration: props.duration,
    accordion: props.accordion,
    expanded: props.expanded,
    register,
    toggle,
    isActive
});

defineExpose<CollapseGroupInstance>({
    expandAll,
    collapseAll
});

onMounted(() => {
    if (props.expanded) {
        toggleAll(true);
    }
    if (Array.isArray(props.defaultActive)) {
        props.defaultActive.forEach(name => {
            activeNameSet.add(name);
        });
    } else {
        activeNameSet.add(props.defaultActive);
    }
});
</script>

<style lang="scss" scoped>
.m-collapse-group {
    display: flex;
    flex-direction: column;
    width: 100%;
}
</style>
