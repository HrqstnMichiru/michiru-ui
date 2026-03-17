<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="wrapperVisible" class="drawer-overlay" @click="onMaskClick" :style="{ zIndex: zIndex }">
                <Transition :name="`slide-${placement}`" appear @after-leave="onAfterLeave">
                    <div v-if="innerVisible" ref="wrapperRef" class="drawer-wrapper" :class="[`drawer-wrapper--${placement}`]" :style="drawerStyle" @click.stop>
                        <!-- 抽屉头部 -->
                        <div
                            v-if="header"
                            ref="headerRef"
                            class="drawer-header"
                            :style="{
                                justifyContent: center ? 'center' : 'flex-start'
                            }">
                            <div class="drawer-title">
                                {{ title }}
                            </div>
                        </div>

                        <!-- 抽屉内容 -->
                        <MScrollBar v-if="scrollable" class="drawer-body" :style="bodyStyle">
                            <slot></slot>
                        </MScrollBar>
                        <div v-else class="drawer-body" :style="bodyStyle">
                            <slot></slot>
                        </div>

                        <div
                            v-if="footer"
                            ref="footerRef"
                            class="drawer-footer"
                            :style="{
                                justifyContent: center ? 'center' : 'flex-end'
                            }">
                            <slot name="footer">
                                <MButton variant="gray" outline :icon="showIcon ? negativeIcon : ''" @click="onCancel" :disabled="loading">{{ negativeText }}</MButton>
                                <MButton variant="primary" :icon="showIcon ? positiveIcon : ''" @click="onConfirm" :loading="loading">{{ positiveText }}</MButton>
                            </slot>
                        </div>
                        <span v-if="closable" class="drawer-close" @click="close"></span>
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<script lang="ts" setup>
import { MButton, MScrollBar } from "@/components";
import { computed, nextTick, onBeforeUnmount, ref, useTemplateRef, watch } from "vue";
import type { MDrawerEmits, MDrawerInstance, MDrawerProps } from "./types";

defineOptions({
    name: "MDrawer"
});
const props = withDefaults(defineProps<MDrawerProps>(), {
    positiveText: "确定",
    negativeText: "取消",
    zIndex: 500,
    loading: false,
    placement: "right",
    footer: true,
    header: true,
    maskClosable: true,
    negativeIcon: "icon-park-outline:close",
    positiveIcon: "mingcute:check-fill",
    showIcon: false,
    closable: true,
    center: false
});

const emits = defineEmits<MDrawerEmits>();

const wrapperVisible = ref<boolean>(false); // 对话框可见状态
const innerVisible = ref<boolean>(false); // 抽屉打开状态
const originalOverflow = ref<string>("");
const wrapperRef = useTemplateRef<HTMLElement>("wrapperRef");
const headerRef = useTemplateRef<HTMLElement>("headerRef");
const footerRef = useTemplateRef<HTMLElement>("footerRef");
const scrollableBodyHeight = ref<number | null>(null);
let resizeObserver: ResizeObserver | null = null;

const isHorizontal = computed(() => props.placement === "left" || props.placement === "right");
const drawerStyle = computed(() => {
    const style: Record<string, string> = {};
    if (isHorizontal.value) {
        style.height = "100vh";
        if (props.width) {
            style.width = `${props.width}px`;
        }
    } else {
        style.width = "100%";
        if (props.height) {
            style.height = `${props.height}px`;
        }
    }
    return style;
});

const lockBodyScroll = () => {
    originalOverflow.value = document.body.style.overflow;
    document.body.style.overflow = "hidden";
};
const unlockBodyScroll = () => {
    document.body.style.overflow = originalOverflow.value;
};

const bodyStyle = computed(() => {
    const style: Record<string, any> = { ...props.contentStyle };
    if (props.center) {
        style.justifyContent = "center";
    }
    if (props.scrollable && scrollableBodyHeight.value !== null) {
        style.height = `${scrollableBodyHeight.value}px`;
    }
    return style;
});

const updateScrollableBodyHeight = () => {
    if (!props.scrollable || !wrapperRef.value) {
        scrollableBodyHeight.value = null;
        return;
    }
    const wrapperHeight = wrapperRef.value.clientHeight;
    const headerHeight = props.header ? (headerRef.value?.offsetHeight ?? 0) : 0;
    const footerHeight = props.footer ? (footerRef.value?.offsetHeight ?? 0) : 0;
    scrollableBodyHeight.value = Math.max(wrapperHeight - headerHeight - footerHeight, 0);
};
const stopObserveSize = () => {
    resizeObserver?.disconnect();
    resizeObserver = null;
    window.removeEventListener("resize", updateScrollableBodyHeight);
};
const startObserveSize = () => {
    if (!wrapperVisible.value || !props.scrollable) return;
    stopObserveSize();
    resizeObserver = new ResizeObserver(updateScrollableBodyHeight);
    if (wrapperRef.value) resizeObserver.observe(wrapperRef.value);
    if (headerRef.value) resizeObserver.observe(headerRef.value);
    if (footerRef.value) resizeObserver.observe(footerRef.value);
    window.addEventListener("resize", updateScrollableBodyHeight);
};

let hideWrapperRafId: number | null = null;
const close = () => {
    if (props.loading) return;
    innerVisible.value = false;
    if (hideWrapperRafId !== null) {
        cancelAnimationFrame(hideWrapperRafId);
    }
    hideWrapperRafId = requestAnimationFrame(() => {
        wrapperVisible.value = false;
        hideWrapperRafId = null;
        stopObserveSize();
    });
    unlockBodyScroll();
};

const onAfterLeave = () => {
    emits("after-close");
};

const onConfirm = async () => {
    if (props.onPositiveClick) {
        const result = await props.onPositiveClick();
        if (result) {
            close();
        }
    } else {
        close();
    }
};

const onCancel = () => {
    props.onNegativeClick?.();
    close();
};

const onMaskClick = (event: MouseEvent) => {
    if (!props.maskClosable) return;
    close();
};

watch(
    () => [props.header, props.footer, props.scrollable, props.placement, props.width, props.height],
    () => {
        if (!wrapperVisible.value) return;
        nextTick(() => {
            updateScrollableBodyHeight();
            startObserveSize();
        });
    }
);

onBeforeUnmount(() => {
    stopObserveSize();
});

defineExpose<MDrawerInstance>({
    close,
    open: async () => {
        wrapperVisible.value = true;
        innerVisible.value = true;
        lockBodyScroll(); // 锁定滚动
        nextTick(() => {
            updateScrollableBodyHeight(); // 计算高度
            startObserveSize(); // 开始监听尺寸变化
        });
    }
});
</script>

<style lang="scss" scoped>
.drawer-overlay {
    position: fixed;
    inset: 0;
    transition: all 0.3s ease-in-out;
    display: flex;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.5);
    .drawer-wrapper {
        background-color: #fff;
        display: flex;
        flex-direction: column;
        border: 1px solid #d1d9e6;
        position: fixed;
        transition: transform 0.3s ease;
        max-height: 100vh;
        overflow: hidden;

        &.drawer-wrapper--left {
            top: 0;
            left: 0;
            height: 100vh;
            min-width: 300px;
            box-shadow: 6px 0px 12px rgba(0, 0, 0, 0.15);
        }

        &.drawer-wrapper--right {
            top: 0;
            right: 0;
            height: 100vh;
            min-width: 200px;
            box-shadow: -6px 0px 12px rgba(0, 0, 0, 0.15);
        }

        &.drawer-wrapper--top {
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 100%;
            min-height: 200px;
            box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.15);
        }

        &.drawer-wrapper--bottom {
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 100%;
            min-height: 200px;
            box-shadow: 0px -6px 12px rgba(0, 0, 0, 0.15);
        }
    }

    .drawer-header {
        display: flex;
        align-items: center;
        padding: 12px 16px 8px;
        border-bottom: 2px solid #e5e7eb;
        .drawer-title {
            background: linear-gradient(90deg, #4096e1 0%, #7c3aed 50%, #f472b6 100%);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            font-size: 24px;
            font-weight: 600;
            line-height: 1.2;
        }
    }

    .drawer-body {
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
        padding: 16px 24px;
        overflow: auto;
    }

    .drawer-footer {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 12px 12px;
        border-top: 2px solid #e5e7eb;
    }

    .drawer-close {
        position: absolute;
        top: 5px;
        right: 5px;
        width: 25px;
        height: 25px;
        cursor: pointer;
        background-image: url("@/assets/image/k_hoshi.png");
        background-size: contain;
        background-repeat: no-repeat;
        transition: all 0.2s ease;
        opacity: 0.6;
        &:hover {
            opacity: 1;
            transform: rotate(45deg);
        }
    }
}

// 抽屉淡入淡出动画
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s cubic-bezier(0.55, 0, 0.1, 1);
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

// 从右侧滑入滑出
.slide-right-enter-active,
.slide-right-leave-active {
    transition: transform 0.3s cubic-bezier(0.55, 0, 0.1, 1);
    will-change: transform;
}

.slide-right-enter-from,
.slide-right-leave-to {
    transform: translate3d(100%, 0, 0);
}

.slide-right-enter-to,
.slide-right-leave-from {
    transform: translate3d(0, 0, 0);
}

// 从左侧滑入滑出
.slide-left-enter-active,
.slide-left-leave-active {
    transition: transform 0.3s cubic-bezier(0.55, 0, 0.1, 1);
    will-change: transform;
}

.slide-left-enter-from,
.slide-left-leave-to {
    transform: translate3d(-100%, 0, 0);
}

.slide-left-enter-to,
.slide-left-leave-from {
    transform: translate3d(0, 0, 0);
}

// 从顶部滑入滑出
.slide-top-enter-active,
.slide-top-leave-active {
    transition: transform 0.3s cubic-bezier(0.55, 0, 0.1, 1);
    will-change: transform;
}

.slide-top-enter-from,
.slide-top-leave-to {
    transform: translate3d(-50%, -100%, 0) !important;
}

.slide-top-enter-to,
.slide-top-leave-from {
    transform: translate3d(-50%, 0, 0) !important;
}

// 从底部滑入滑出
.slide-bottom-enter-active,
.slide-bottom-leave-active {
    transition: transform 0.3s cubic-bezier(0.55, 0, 0.1, 1);
    will-change: transform;
}

.slide-bottom-enter-from,
.slide-bottom-leave-to {
    transform: translate3d(-50%, 100%, 0) !important;
}

.slide-bottom-enter-to,
.slide-bottom-leave-from {
    transform: translate3d(-50%, 0, 0) !important;
}
</style>
