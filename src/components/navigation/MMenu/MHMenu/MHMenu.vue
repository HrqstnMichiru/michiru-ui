<template>
    <MTooltipProvider>
        <div class="h-menu" ref="containerRef">
            <slot></slot>
            <div class="active-bar" :class="{ 'active-bar--ready': isReady }" :style="barStyle"></div>
            <div v-for="(item, index) in stateList" :key="item.data.name" ref="itemRefs" class="wrapper">
                <template v-if="item.children">
                    <MenuNode v-bind="item">
                        <template #default="{ active, data }">
                            <div
                                class="menu-item"
                                :class="{
                                    'menu-item--active': activeIndex === index,
                                    'menu-item--disabled': data.disabled
                                }">
                                <MIcon :name="data.icon" :size="20" v-if="data.icon"></MIcon>
                                <span class="label">{{ data.label }}</span>
                                <MIcon
                                    name="material-symbols:arrow-forward-ios"
                                    class="open-icon"
                                    :size="16"
                                    :class="{
                                        'open-icon--active': active
                                    }"></MIcon>
                            </div>
                        </template>
                    </MenuNode>
                </template>
                <template v-else>
                    <div
                        @click="setCurrent(item.data.name)"
                        class="menu-item"
                        :class="{
                            'menu-item--active': activeIndex === index,
                            'menu-item--disabled': item.data.disabled
                        }">
                        <MIcon :name="item.data.icon" :size="20" v-if="item.data.icon"></MIcon>
                        <span class="label">{{ item.data.label }}</span>
                    </div>
                </template>
            </div>
        </div>
    </MTooltipProvider>
</template>

<script lang="ts" setup>
import { MIcon } from "@/components";
import { computed, nextTick, onMounted, provide, ref, shallowReactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import MenuNode from "./MHMenuNode.vue";
import type { MHMenuContext, MHMenuInstance, MHMenuItemModel, MHMenuItemProps, MHMenuProps } from "./types";
import { MHMenuContextKey } from "./types";
import { MTooltipProvider } from "@/components";

defineOptions({
    name: "MHMenu"
});
const props = withDefaults(defineProps<MHMenuProps>(), {
    router: false
});

const route = useRoute();
const _router = useRouter();

const activeKey = ref<string | number>(props.router ? route.path : props.defaultActive || "");
const activeIndex = ref<number>(-1); // 当前激活项的索引
const isReady = ref<boolean>(false);
const itemRefs = ref<HTMLElement[]>([]);
const barStyle = ref({ left: "0px", width: "0px", opacity: "0" });
const stateList = shallowReactive<Array<MHMenuItemModel>>([]); // 子菜单项状态列表
const nodesMap = shallowReactive<Map<string | number, MHMenuItemModel>>(new Map());
const updateBar = () => {
    if (activeIndex.value === -1) {
        barStyle.value = { left: "0px", width: "0px", opacity: "0" };
        return;
    }
    const el = itemRefs.value[activeIndex.value];
    barStyle.value = {
        left: `${el.offsetLeft}px`,
        width: `${el.offsetWidth}px`,
        opacity: "1"
    };
};
const setCurrent = (name: string | number, initial: boolean = false) => {
    if (!initial) {
        isReady.value = true;
    }
    const currentItem = nodesMap.get(name);
    if (!currentItem) return;
    let parentIndex = -1;
    if (currentItem.parentName) {
        let parentKey: string | number | undefined = currentItem.parentName;
        while (parentKey) {
            const parentItem = nodesMap.get(parentKey);
            if (parentItem?.parentName === undefined) break;
            parentKey = parentItem?.parentName;
        }
        parentIndex = stateList.findIndex(item => item.data.name === parentKey);
    } else {
        parentIndex = stateList.findIndex(item => item.data.name === name);
    }
    activeKey.value = name;
    if (parentIndex !== activeIndex.value) {
        activeIndex.value = parentIndex;
        nextTick(updateBar);
    }
    activeIndex.value = parentIndex;
    nextTick(updateBar);
    if (props.router && !initial) {
        _router.push(name.toString());
    }
};

const currentPath = computed<Array<MHMenuItemProps>>(() => {
    const path: Array<MHMenuItemProps> = [];
    let currentKey: string | number | undefined = activeKey.value;
    while (currentKey) {
        const currentItem = nodesMap.get(currentKey);
        if (currentItem) {
            path.unshift(currentItem.data);
        }
        currentKey = currentItem?.parentName;
    }
    return path;
});

provide<MHMenuContext>(MHMenuContextKey, {
    isActive: name => activeKey.value === name,
    setCurrent,
    registerState: state => stateList.push(state),
    registerNode: node => nodesMap.set(node.data.name, node)
});

defineExpose<MHMenuInstance>({
    get currentPath() {
        return currentPath.value;
    }
});

onMounted(() => {
    if (activeKey.value === "") {
        activeKey.value = stateList[0].data.name;
    }
    setCurrent(activeKey.value, true);
});
</script>

<style lang="scss" scoped>
.h-menu {
    display: flex;
    align-items: center;
    position: relative;
    gap: 2px;
    .active-bar {
        position: absolute;
        z-index: 0;
        left: 0;
        top: 0;
        border-radius: 6px;
        height: 36px;
        opacity: 1;
        background-color: rgba(240, 218, 255, 1);
        &.active-bar--ready {
            transition: all 0.3s var(--ease-in-out);
        }
    }
    .wrapper {
        z-index: 1;
        .menu-item {
            z-index: 1;
            padding: 0 10px;
            display: inline-flex;
            align-items: center;
            border-radius: 6px;
            height: 36px;
            font-weight: 500;
            cursor: pointer;
            gap: 8px;
            color: rgb(107, 107, 107);
            white-space: nowrap;
            transition:
                background-color 0.2s var(--ease-in-out),
                color 0.3s var(--ease-in-out);
            .label {
                font-size: 16px;
                color: #333;
                white-space: nowrap;
                transition: color 0.3s ease;
            }
            .open-icon {
                color: rgb(107, 107, 107);
                transition: all 0.3s ease;
                transform: rotate(90deg);
                &.open-icon--active {
                    transform: rotate(270deg);
                }
            }
            &:hover {
                background-color: rgba(0, 0, 0, 0.1);
            }
            &.menu-item--active {
                color: #801eff;
                .label {
                    color: #801eff;
                }
                .open-icon {
                    color: #801eff;
                }
                &:hover {
                    background-color: transparent;
                }
            }
            &.menu-item--disabled {
                color: #a8abb2;
                cursor: not-allowed;
                .label {
                    color: #a8abb2;
                }
                .open-icon {
                    color: #a8abb2;
                }
                &:hover {
                    background-color: transparent;
                }
            }
        }
    }
}
</style>
