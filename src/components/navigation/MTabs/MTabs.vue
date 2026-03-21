<template>
    <div
        class="m-tabs"
        :class="[`m-tabs--${position}`]"
        :style="{
            gap: `${gap}px`
        }">
        <div
            class="m-tabs__nav"
            :class="[`m-tabs__nav--${direction}`, `m-tabs__nav--${variant}`]"
            :style="{
                width: direction === 'vertical' ? `${width}px` : '100%',
                justifyContent: center ? 'center' : variant === 'box' ? 'space-between' : 'flex-start'
            }">
            <div class="m-tabs__active-bar" :style="activeBarStyle" :class="{ 'm-tabs__active-bar--ready': isReady }"></div>
            <div
                class="m-tabs__nav-list"
                :style="{
                    gap: `${gutter}px`,
                    width: inline ? 'fit-content' : '100%'
                }">
                <div
                    v-for="(item, index) in tabItemList"
                    :key="item.name ?? index"
                    :ref="el => setItemRef(el, item.name)"
                    class="m-tabs__nav-item"
                    :class="{
                        'm-tabs__nav-item--active': isActive(item.name),
                        'm-tabs__nav-item--disabled': item.disabled || props.disabled
                    }"
                    @click="setActiveTab(item, index)">
                    <MIcon :name="item.icon" v-if="item.icon" :size="20" />
                    <span>{{ item.label }}</span>
                    <span class="close-icon" v-if="variant === 'box' && !item.fixed && closable" @click.stop="closeTab(index)">
                        <MIcon name="ri:close-large-line" :size="16" />
                    </span>
                </div>
            </div>
            <div v-if="variant === 'box'" class="m-tabs__nav-action">
                <slot name="action"></slot>
            </div>
        </div>
        <div class="m-tabs__content">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { MIcon } from "@/components";
import { computed, nextTick, onMounted, provide, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { MTabPanelProps, MTabsContext, MTabsEmits, MTabsInstance, MTabsProps } from "./types";
import { MTabContextKey } from "./types";

const _router = useRouter();
const route = useRoute();

defineOptions({
    name: "MTabs"
});
const props = withDefaults(defineProps<MTabsProps>(), {
    direction: "horizontal",
    variant: "card",
    position: "top",
    router: false,
    closable: false,
    addable: false,
    defaultActive: 0,
    gap: 0,
    width: 200
});
const emits = defineEmits<MTabsEmits>();

const isReady = ref<boolean>(false);
const activeTab = ref<number | string>(props.defaultActive); // 当前激活的标签页
const currentIndex = ref<number>(0); // 当前激活标签页的索引
const switchDirection = ref<"left" | "right">("right");
const tabItemList = reactive<MTabPanelProps[]>([]);
const itemRefs = new Map<string | number, HTMLElement>();
const isAnimating = ref(false);
const direction = computed(() => {
    if (props.position === "top" || props.position === "bottom") {
        return "horizontal";
    } else {
        return "vertical";
    }
});
const activeBarStyle = computed(() => {
    const style: any = {};
    if (direction.value === "horizontal") {
        style.width = `${barStyle.width}px`;
        style.height = "100%";
        style.transform = `translateX(${barStyle.left}px)`;
    } else {
        style.width = "100%";
        style.height = `${barStyle.height}px`;
        style.transform = `translateY(${barStyle.top}px)`;
    }
    return style;
});

const barStyle = reactive({
    width: 0,
    height: 0,
    left: 0,
    top: 0
});
const updateBar = () => {
    const el = itemRefs.get(activeTab.value);
    if (!el) return;
    barStyle.width = el.offsetWidth;
    barStyle.height = el.offsetHeight;
    barStyle.left = el.offsetLeft;
    barStyle.top = el.offsetTop;
};

const setItemRef = (el: any, name: string | number) => {
    if (el) {
        itemRefs.set(name, el);
    }
};

const setActiveTab = (item: MTabPanelProps, targetIndex: number) => {
    if (isAnimating.value) return;
    if (item.disabled || props.disabled) return;
    if (activeTab.value === item.name) return;
    isReady.value = true;

    switchDirection.value = targetIndex > currentIndex.value ? "right" : "left";
    activeTab.value = item.name;
    currentIndex.value = targetIndex;
    isAnimating.value = true;
    if (props.router) {
        _router.push(item.name.toString());
    }
    emits("change");
    setTimeout(() => {
        isAnimating.value = false;
    }, 500);
};

const isActive = (name: string | number) => {
    return activeTab.value === name;
};

const register = (item: MTabPanelProps) => {
    if (tabItemList.some(tab => tab.name === item.name)) return;
    tabItemList.push(item);
    if (props.router && item.name === route.path) {
        activeTab.value = item.name;
        currentIndex.value = tabItemList.length - 1;
        return;
    }
    if (props.defaultActive) {
        if (item.name === props.defaultActive) {
            activeTab.value = item.name;
            currentIndex.value = tabItemList.length - 1;
        }
    } else {
        if (tabItemList.length === 1) {
            activeTab.value = item.name;
            currentIndex.value = 0;
        }
    }
};

const addTab = (item: MTabPanelProps) => {
    if (!props.addable) return;
    const index = tabItemList.findIndex(tab => tab.name === item.name);
    if (index !== -1) {
        setActiveTab(item, index);
    } else {
        tabItemList.push(item);
        const targetIndex = tabItemList.length - 1;
        setActiveTab(item, targetIndex);
    }
};

const closeTab = (index: number) => {
    const targetTab = tabItemList[index]!;
    if (targetTab.name === activeTab.value) {
        let newIndex: number;
        if (index === tabItemList.length - 1) {
            newIndex = index - 1;
            switchDirection.value = "left";
        } else {
            newIndex = index + 1;
            switchDirection.value = "right";
        }
        if (newIndex >= 0 && newIndex < tabItemList.length) {
            const nextActiveName = tabItemList[newIndex]!.name;
            activeTab.value = nextActiveName;
            currentIndex.value = index === tabItemList.length - 1 ? newIndex : index;
            if (props.router) {
                _router.push(nextActiveName.toString());
            }
        }
    } else if (index < currentIndex.value) {
        currentIndex.value -= 1;
    }
    tabItemList.splice(index, 1);
    itemRefs.delete(targetTab.name);
};

provide<MTabsContext>(MTabContextKey, {
    register,
    isActive,
    get switchDirection() {
        return switchDirection.value;
    },
    router: props.router
});

defineExpose<MTabsInstance>({
    addTab,
    get switchDirection() {
        return switchDirection.value;
    }
});

watch(
    () => activeTab.value,
    () => nextTick(updateBar)
);
onMounted(() => nextTick(updateBar));
</script>

<style lang="scss" scoped>
.m-tabs {
    display: flex;
    .m-tabs__nav {
        display: flex;
        position: relative;
        height: 42px;
        .m-tabs__active-bar {
            position: absolute;
            z-index: 1;
            left: 0;
            top: 0;
            opacity: 1;
            &.m-tabs__active-bar--ready {
                transition: all 500ms var(--ease-in-out);
            }
        }
        .m-tabs__nav-list {
            display: flex;
            align-items: center;
            .m-tabs__nav-item {
                display: flex;
                align-items: center;
                z-index: 2;
                cursor: pointer;
                padding: 8px 12px;
                line-height: 24px;
                font-weight: 500;
                user-select: none;
                transition: all 500ms ease;
                font-size: 16px;
                gap: 5px;
                color: #404040;
                .close-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    flex-shrink: 0;
                    border-radius: 20px;
                    padding: 4px;
                    margin-right: -6px;
                    transition: background-color 0.2s ease;
                    &:hover {
                        background-color: rgba(0, 0, 0, 0.15);
                    }
                }
                &.m-tabs__nav-item--disabled {
                    color: #cbd5e1;
                    cursor: not-allowed;
                    opacity: 0.5;
                }
            }
        }
        .m-tabs__nav-action {
            flex-shrink: 0;
            width: fit-content;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }
        &.m-tabs__nav--horizontal {
            justify-content: flex-start;
            flex-direction: row;
            width: 100%;
            .m-tabs__nav-item {
                justify-content: center;
            }
        }
        &.m-tabs__nav--vertical {
            flex-direction: column;
            height: fit-content;
            .m-tabs__nav-item {
                width: 100%;
            }
        }
    }
    .m-tabs__content {
        position: relative;
        flex: 1;
        overflow: hidden;
    }
    .m-tabs__nav--card {
        .m-tabs__nav-item {
            &:hover:not(.m-tabs__nav-item--disabled):not(.m-tabs__nav-item--active) {
                color: #8b5cf6;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
            }
            &.m-tabs__nav-item--active {
                color: white;
                font-weight: 500;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
            }
        }
        &.m-tabs__nav--horizontal {
            border-bottom: 2px solid #801eff;
            .m-tabs__active-bar {
                background: #801eff;
                border-radius: 16px 16px 0 0;
            }
            .m-tabs__nav-item {
                border-radius: 16px 16px 0 0;
            }
        }
        &.m-tabs__nav--vertical {
            border-left: 2px solid #801eff;
            .m-tabs__active-bar {
                background: #801eff;
                border-radius: 0 16px 16px 0;
            }
            .m-tabs__nav-item {
                border-radius: 0 16px 16px 0;
            }
        }
    }
    .m-tabs__nav--line,
    .m-tabs__nav--bar {
        height: 36px;
        .m-tabs__nav-item {
            padding: 0 !important;
            border-radius: 0;
            &:hover:not(.m-tabs__nav-item--disabled):not(.m-tabs__nav-item--active) {
                color: #8b5cf6;
            }
            &.m-tabs__nav-item--active {
                color: #801eff;
                font-weight: 500;
            }
        }
        &.m-tabs__nav--horizontal {
            .m-tabs__active-bar {
                height: 0 !important;
                border-bottom: 2px solid #801eff;
                bottom: -1px !important;
                top: auto;
            }
        }
        &.m-tabs__nav--vertical {
            .m-tabs__active-bar {
                width: 0 !important;
                border-left: 2px solid #801eff;
                right: auto;
                left: -1px !important;
            }
        }
    }
    .m-tabs__nav--line {
        &.m-tabs__nav--horizontal .m-tabs__nav-list {
            border-bottom: 1px solid #e4e7ed;
        }
        &.m-tabs__nav--vertical .m-tabs__nav-list {
            border-left: 1px solid #e4e7ed;
        }
    }
    .m-tabs__nav--segmented {
        height: fit-content;
        padding: 3px;
        border-radius: 8px;
        background: #f0f0f0;
        overflow: hidden;
        .m-tabs__active-bar {
            z-index: 1;
            background: #801eff;
            border-radius: 6px;
            top: 3px !important;
            bottom: 3px !important;
            height: auto !important;
        }
        .m-tabs__nav-item {
            border-radius: 6px;
            color: #606266;
            font-weight: 400;
            &:hover:not(.m-tabs__nav-item--disabled):not(.m-tabs__nav-item--active) {
                color: #8b5cf6;
            }
            &.m-tabs__nav-item--active {
                color: #fff;
                font-weight: 500;
            }
        }
        &.m-tabs__nav--vertical {
            .m-tabs__active-bar {
                left: 3px !important;
                right: 3px !important;
                width: auto !important;
            }
        }
    }
    .m-tabs__nav--box {
        border: 1px solid rgb(220, 223, 230);
        background-color: #fff;
        .m-tabs__nav-item {
            border-right: 1px solid rgb(220, 223, 230);
            border-top: 1px solid transparent;
            background-color: #fff;
            &:hover:not(.m-tabs__nav-item--disabled):not(.m-tabs__nav-item--active) {
                color: #8b5cf6;
                background: rgba(128, 30, 255, 0.06);
            }
            &.m-tabs__nav-item--active {
                border-top-color: #801eff;
                color: #801eff;
                font-weight: 500;
                background: rgba(128, 30, 255, 0.25);
            }
        }
        .m-tabs__active-bar {
            display: none;
        }
    }
    &.m-tabs--top {
        flex-direction: column;
        .m-tabs__nav {
            order: 0;
        }
        .m-tabs__content {
            order: 1;
        }
    }
    &.m-tabs--bottom {
        flex-direction: column;
        .m-tabs__nav {
            order: 1;
        }
        .m-tabs__content {
            order: 0;
        }
    }
    &.m-tabs--left {
        flex-direction: row;
        .m-tabs__nav {
            order: 0;
        }
        .m-tabs__content {
            order: 1;
        }
    }
    &.m-tabs--right {
        flex-direction: row;
        .m-tabs__nav {
            order: 1;
        }
        .m-tabs__content {
            order: 0;
        }
    }
}
</style>
