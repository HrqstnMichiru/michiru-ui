<template>
    <slot></slot>
</template>

<script lang="ts" setup>
import { computed, inject, onMounted, provide, shallowReactive } from "vue";
import type { HMenuContext, HMenuItemModel, HMenuItemProps, HSubMenuContext } from "./types";
import { HMenuContextKey, HSubMenuContextKey } from "./types";

defineOptions({
    name: "MHSubMenu"
});
const props = defineProps<HMenuItemProps>();
const context = inject<HSubMenuContext | null>(HSubMenuContextKey, null);
const menuContext = inject<HMenuContext | null>(HMenuContextKey);

const stateList = shallowReactive<Array<HMenuItemModel>>([]); // 子菜单项状态列表
const isActive = computed(() => {
    return stateList.some(item => item.active);
});
provide<HSubMenuContext>(HSubMenuContextKey, {
    registerState: state => stateList.push(state),
    parentName: props.name
});

onMounted(() => {
    const currentItem: HMenuItemModel = {
        data: props,
        children: stateList,
        parentName: context?.parentName,
        get active() {
            return isActive.value;
        }
    };
    if (context) {
        context.registerState(currentItem);
    } else if (menuContext) {
        menuContext.registerState(currentItem);
    }
    menuContext?.registerNode(currentItem);
});
</script>
