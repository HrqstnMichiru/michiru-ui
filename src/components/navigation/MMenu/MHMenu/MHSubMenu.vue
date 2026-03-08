<template>
    <slot></slot>
</template>

<script lang="ts" setup>
import { computed, inject, onMounted, provide, shallowReactive } from "vue";
import type { MHMenuContext, MHMenuItemModel, MHMenuItemProps, MHSubMenuContext } from "./types";
import { MHMenuContextKey, MHSubMenuContextKey } from "./types";

defineOptions({
    name: "MHSubMenu"
});
const props = defineProps<MHMenuItemProps>();
const context = inject<MHSubMenuContext | null>(MHSubMenuContextKey, null);
const menuContext = inject<MHMenuContext | null>(MHMenuContextKey);

const stateList = shallowReactive<Array<MHMenuItemModel>>([]); // 子菜单项状态列表
const isActive = computed(() => {
    return stateList.some(item => item.active);
});
provide<MHSubMenuContext>(MHSubMenuContextKey, {
    registerState: state => stateList.push(state),
    parentName: props.name
});

onMounted(() => {
    const currentItem: MHMenuItemModel = {
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
