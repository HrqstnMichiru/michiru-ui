<template>
    <Transition :name="transitionName">
        <slot v-if="tabContext?.isActive(props.name)"></slot>
    </Transition>
</template>

<script lang="ts" setup>
import { computed, inject } from "vue";
import type { TabContext, TabPanelProps } from "./types";
import { TabContextKey } from "./types";

defineOptions({
    name: "MTabPane"
});
const props = defineProps<TabPanelProps>();
const tabContext = inject<TabContext>(TabContextKey);
if (tabContext) {
    tabContext.register({ ...props });
}

const transitionName = computed(() => {
    return tabContext?.switchDirection === "left" ? "slide-left" : "slide-right";
});
</script>

<style lang="scss" scoped>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
    transition: all 400ms var(--ease-in-out);
}

// 离开的元素脱离文档流，进入的元素正常占据空间
.slide-left-leave-active,
.slide-right-leave-active {
    position: absolute;
    top: 0;
    left: 16px;
    width: calc(100% - 32px);
    height: calc(100% - 16px);
}

// 向左切换：元素从右侧进入，初始位于右侧100%处，不可见
// 向右切换：元素从右侧离开，最终位于右侧100%处，不可见
.slide-left-leave-to,
.slide-right-enter-from {
    opacity: 0;
    translate: 100%;
}

// 向右切换：元素从左侧进入，初始位于左侧100%处，不可见
// 向左切换：元素从左侧离开，最终位于左侧100%处，不可见
.slide-left-enter-from,
.slide-right-leave-to {
    opacity: 0;
    translate: -100%;
}

.slide-left-enter-to,
.slide-left-leave-from,
.slide-right-enter-to,
.slide-right-leave-from {
    opacity: 1;
    translate: 0;
}
</style>
