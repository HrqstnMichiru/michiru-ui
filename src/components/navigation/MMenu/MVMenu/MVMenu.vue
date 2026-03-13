<template>
    <MTooltipProvider>
        <div
            class="v-menu"
            :style="{
                width: `${customWidth}px`,
                '--menu-speed': `${duration}ms`
            }">
            <slot></slot>
        </div>
    </MTooltipProvider>
</template>

<script lang="ts" setup>
import { MTooltipProvider } from "@/components";
import { computed, onMounted, provide, ref, shallowReactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { MVMenuContext, MVMenuEmits, MVMenuInstance, MVMenuItemModel, MVMenuItemProps, MVMenuProps } from "./types";
import { MVMenuContextKey } from "./types";

const sleep = async (ms: number) => await new Promise(resolve => setTimeout(resolve, ms));

defineOptions({
    name: "MVMenu"
});
const props = withDefaults(defineProps<MVMenuProps>(), {
    expand: false,
    accordion: false,
    duration: 300,
    collapsed: false,
    width: 240,
    defaultExpand: (): Array<number | string> => []
});
const emits = defineEmits<MVMenuEmits>();
const route = useRoute();
const _router = useRouter();

const COLLAPSED_WIDTH = 64; // 折叠时的固定宽度
const collapsed = ref<boolean>(props.collapsed); // 是否处于折叠状态
const customWidth = ref<number>(props.collapsed ? COLLAPSED_WIDTH : props.width); // 当前宽度
const activeKey = ref<string | number>(props.router ? route.path : props.defaultActive || ""); // 当前激活菜单项
const menuItems = shallowReactive<Map<string | number, MVMenuItemModel>>(new Map()); // 存储所有菜单项数据
const childrenItems = shallowReactive<Array<{ active: boolean; name: string | number }>>([]); // 存储直接子菜单项数据，便于处理手风琴效果
const openKeys = shallowReactive<Set<string | number>>(new Set()); // 存储展开的菜单项

const register = (item: MVMenuItemModel) => {
    menuItems.set(item.data.name, item);
};
const isExpanded = (name: string | number): boolean => {
    return openKeys.has(name);
};
const setCurrent = async (name: string | number, initial: boolean = false) => {
    const item = menuItems.get(name);
    if (!item) return;
    // 依次展开所有父级路径
    if (!collapsed.value) {
        const parentPath: Array<string | number> = [];
        let parentKey: string | number | undefined = item.parentName;
        while (parentKey) {
            if (!openKeys.has(parentKey)) {
                parentPath.push(parentKey);
            }
            const parentItem = menuItems.get(parentKey);
            parentKey = parentItem?.parentName;
        }
        for (const parent of parentPath.reverse()) {
            openKeys.add(parent);
            await sleep(props.duration);
        }
    }
    if (item.isLeaf) {
        activeKey.value = name;
        if (!initial) {
            emits("change", item.data);
        }
        if (props.router) {
            _router.push(name.toString());
        }
    } else {
        if (collapsed.value) return;
        if (props.accordion) {
            const parentKey = item.parentName;
            let siblings: Array<string | number> = [];
            if (!parentKey) {
                siblings = childrenItems.map(child => child.name);
            } else {
                const parentItem = menuItems.get(parentKey);
                siblings = parentItem?.children || [];
            }
            siblings.forEach(sibling => {
                if (sibling !== name) {
                    openKeys.delete(sibling); // 收起同级菜单
                }
            });
        }
        if (openKeys.has(name)) {
            openKeys.delete(name);
        } else {
            openKeys.add(name);
        }
    }
};
const toggleCollapse = async () => {
    if (!collapsed.value) {
        openKeys.clear(); // 折叠时收起所有菜单
        await sleep(props.duration); // 等待折叠动画完成
        customWidth.value = COLLAPSED_WIDTH;
        collapsed.value = !collapsed.value;
    } else {
        customWidth.value = props.width;
        collapsed.value = !collapsed.value; // 展开时先设置宽度，等待动画完成后再展开菜单
        await sleep(props.duration);
        const activeItem = menuItems.get(activeKey.value);
        const parentPath: Array<string | number> = [];
        let parentKey: string | number | undefined = activeItem?.parentName;
        while (parentKey) {
            parentPath.push(parentKey);
            const parentItem = menuItems.get(parentKey);
            parentKey = parentItem?.parentName;
        }
        for (const parent of parentPath.reverse()) {
            openKeys.add(parent);
            await sleep(props.duration);
        }
    }
};

const currentPath = computed<Array<MVMenuItemProps>>(() => {
    const path: Array<MVMenuItemProps> = [];
    let currentKey: string | number | undefined = activeKey.value;
    while (currentKey) {
        const currentItem = menuItems.get(currentKey);
        if (currentItem) {
            path.unshift(currentItem.data);
        }
        currentKey = currentItem?.parentName;
    }
    return path;
});

provide<MVMenuContext>(MVMenuContextKey, {
    duration: props.duration,
    get collapsed() {
        return collapsed.value;
    },
    register,
    isActive: name => activeKey.value === name,
    setCurrent,
    isExpanded,
    registerState: state => childrenItems.push(state)
});

defineExpose<MVMenuInstance>({
    toggleCollapse,
    get currentPath() {
        return currentPath.value;
    },
    get isCollapsed() {
        return collapsed.value;
    }
});

onMounted(() => {
    if (activeKey.value === "") {
        activeKey.value = childrenItems[0].name;
    }
    setCurrent(activeKey.value, true);
});
</script>

<style lang="scss" scoped>
.v-menu {
    display: flex;
    flex-direction: column;
    padding: 10px;
    transition: width var(--menu-speed) var(--ease-in-out);
}
</style>
