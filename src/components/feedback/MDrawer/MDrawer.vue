<template>
    <Teleport to="body">
        <Transition name="fade" @after-enter="onAfterEnter">
            <div v-if="wrapperVisible" class="drawer-overlay" @click="onMaskClick" :class="[`drawer-overlay--${maskTheme}`]" :style="{ zIndex: zIndex }" ref="maskRef">
                <Transition :name="`slide-${placement}`" @after-leave="onAfterClose">
                    <div v-if="innerVisible" class="drawer-wrapper" :class="[`drawer-wrapper--${placement}`]" :style="drawerStyle">
                        <!-- 上下方向: 拖动指示器 -->
                        <div v-if="placement === 'bottom'" class="drawer-indicator" @mousedown="onIndicatorMouseDown"></div>

                        <!-- 抽屉头部 -->
                        <div v-if="isHorizontal" class="drawer-header">
                            <div class="drawer-title">
                                {{ title }}
                            </div>
                        </div>

                        <!-- 抽屉内容 -->
                        <MScrollBar v-if="isHorizontal" class="drawer-body" :height="scrollHeight">
                            <slot></slot>
                        </MScrollBar>
                        <div v-else class="drawer-body">
                            <slot></slot>
                        </div>

                        <!-- 上方向: 拖动指示器在底部 -->
                        <div v-if="placement === 'top'" class="drawer-indicator" @mousedown="onIndicatorMouseDown"></div>

                        <div v-if="isHorizontal && footer" class="drawer-footer">
                            <slot name="footer">
                                <MButton variant="gray" outline icon="icon-park-outline:close" @click="onCancel" :icon-size="20" :disabled="loading">{{ cancelText }}</MButton>
                                <MButton variant="primary" icon="mingcute:check-fill" @click="onConfirm" :loading="loading" :icon-size="20">{{ confirmText }}</MButton>
                            </slot>
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<script lang="ts" setup>
import { MButton, MScrollBar } from "@/components";
import { computed, ref, useTemplateRef, watch } from "vue";
import type { MDrawerEmits, MDrawerInstance, MDrawerProps } from "./types";

defineOptions({
    name: "MDrawer"
});
const props = withDefaults(defineProps<MDrawerProps>(), {
    confirmText: "确定",
    cancelText: "取消",
    maskTheme: "dark",
    zIndex: 500,
    loading: false,
    placement: "right",
    footer: true
});

const emits = defineEmits<MDrawerEmits>();

const wrapperVisible = ref<boolean>(false); // 对话框可见状态
const innerVisible = ref<boolean>(false); // 抽屉打开状态
const originalOverflow = ref<string>(""); // 保存原始 overflow 值
const scrollHeight = computed(() => {
    if (props.footer) {
        return window.innerHeight - 129;
    } else {
        return window.innerHeight - 60;
    }
});
const maskRef = useTemplateRef<HTMLDivElement>("maskRef");
const confirmed = ref<boolean>(false); // 确认状态
const loading = ref<boolean>(false);
const isDrawerDragging = ref<boolean>(false);
const dragStartY = ref<number>(0); // 拖动起始位置
const dragOffset = ref<number>(0); // 拖动偏移量

// 判断是否为水平方向
const isHorizontal = computed(() => {
    return props.placement === "left" || props.placement === "right";
});

// 根据位置计算抽屉样式
const drawerStyle = computed(() => {
    const style: Record<string, string> = {};

    if (isHorizontal.value) {
        // 左右方向：height 为 100%
        style.height = "100%";
        if (props.width) {
            style.width = `${props.width}px`;
        }
    } else {
        // 上下方向：根据位置决定加减偏移量
        const delta = props.placement === "bottom" ? -dragOffset.value : dragOffset.value;
        const current = props.height! + delta;
        const maxHeight = window.innerHeight / 2;
        const clampedHeight = Math.min(current, maxHeight);
        style.height = `${clampedHeight}px`;
        if (props.width) {
            style.width = `${props.width}px`;
        }
    }
    return style;
});

// 锁定/解锁 body 滚动
const lockBodyScroll = () => {
    originalOverflow.value = document.body.style.overflow;
    document.body.style.overflow = "hidden";
};

const unlockBodyScroll = () => {
    document.body.style.overflow = originalOverflow.value;
};

const onIndicatorMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    if (dragStartY.value === 0) {
        dragStartY.value = e.clientY;
    }
    isDrawerDragging.value = true;
    document.body.style.userSelect = "none";
    document.addEventListener("mousemove", onDocumentMouseMove);
    document.addEventListener("mouseup", onDocumentMouseUp);
};

const onDocumentMouseMove = (e: MouseEvent) => {
    if (!isDrawerDragging.value) return;
    const offsetY = e.clientY - dragStartY.value;
    if (props.placement === "top" && offsetY < 0) return;
    dragOffset.value = e.clientY - dragStartY.value;
};

const onDocumentMouseUp = () => {
    if (!isDrawerDragging.value) return;
    const threshold = 80; // 拖动了 80px 才会关闭
    const deltaY = dragOffset.value;
    if (props.placement === "bottom" && deltaY > threshold) {
        close();
    }

    document.removeEventListener("mousemove", onDocumentMouseMove);
    document.removeEventListener("mouseup", onDocumentMouseUp);
    document.body.style.userSelect = "auto";

    setTimeout(() => {
        isDrawerDragging.value = false;
    }, 500);
};

// 监听 visible 变化，控制 body 滚动
watch(wrapperVisible, newVal => {
    if (newVal) {
        lockBodyScroll();
    } else {
        unlockBodyScroll();
    }
});

const onCancel = () => {
    confirmed.value = false; // 重置确认状态
    close();
};

const close = () => {
    innerVisible.value = false;
    emits("after-close", confirmed.value);
};

const delayedClose = () => {
    setTimeout(() => {
        close();
    }, 500);
};

const onAfterClose = () => {
    dragOffset.value = 0;
    dragStartY.value = 0;
    isDrawerDragging.value = false;
    wrapperVisible.value = false;
};

const onAfterEnter = () => {
    innerVisible.value = true;
};

const onConfirm = async () => {
    if (props.confirm) {
        loading.value = true;
        const result = await props.confirm();
        loading.value = false;
        if (!result) return;
        confirmed.value = true; // 标记为已确认
        delayedClose();
    } else {
        onCancel();
    }
};

const onMaskClick = (event: MouseEvent) => {
    if (props.maskClosable && event.target === maskRef.value && !isDrawerDragging.value) {
        close();
    }
};

defineExpose<MDrawerInstance>({
    close,
    delayedClose,
    open: () => {
        wrapperVisible.value = true;
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
    &.drawer-overlay--no-mask {
        background-color: rgba(255, 255, 255, 0.01);
    }
    &.drawer-overlay--light {
        background-color: rgba(255, 255, 255, 0.5);
    }
    &.drawer-overlay--dark {
        background-color: rgba(0, 0, 0, 0.5);
    }
}

.drawer-wrapper {
    background-color: #fff;
    display: flex;
    flex-direction: column;
    border: 1px solid #d1d9e6;
    position: fixed;
    transition: transform 0.3s ease;

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
        min-width: 300px;
        box-shadow: -6px 0px 12px rgba(0, 0, 0, 0.15);
    }

    &.drawer-wrapper--top {
        background-color: #fdf7ff;
        top: 0;
        left: 50%;
        transform: translate(-50%, 0);
        min-width: 600px;
        border-radius: 0 0 16px 16px;
        box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.15);
    }

    &.drawer-wrapper--bottom {
        background-color: #fdf7ff;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 0);
        min-width: 600px;
        border-radius: 16px 16px 0 0;
        box-shadow: 0px -6px 12px rgba(0, 0, 0, 0.15);
    }
}

.drawer-header {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px 16px 8px;
    border-bottom: 2px solid #e5e7eb;
    .drawer-title {
        background: linear-gradient(90deg, #4096e1 0%, #7c3aed 50%, #f472b6 100%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        font-size: 24px;
        font-weight: 600;
        line-height: 1.4;
    }
}

.drawer-body {
    flex: 1;
    padding: 20px 24px;
}

.drawer-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 0;
    cursor: pointer;

    &::before {
        content: "";
        display: block;
        width: 40px;
        height: 4px;
        background-color: #d4d5d9;
        border-radius: 2px;
    }
}

.drawer-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 16px 16px 20px;
    border-top: 2px solid #e5e7eb;
}

// 抽屉淡入淡出动画
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

// 从右侧滑入滑出
.slide-right-enter-active,
.slide-right-leave-active {
    transition: transform 0.3s ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
    transform: translateX(100%);
}

// 从左侧滑入滑出
.slide-left-enter-active,
.slide-left-leave-active {
    transition: transform 0.3s ease;
}

.slide-left-enter-from,
.slide-left-leave-to {
    transform: translateX(-100%);
}

// 从顶部滑入滑出
.slide-top-enter-active,
.slide-top-leave-active {
    transition: transform 0.3s ease-in-out;
}

.slide-top-enter-from,
.slide-top-leave-to {
    transform: translate(-50%, -100%) !important;
}

// 从底部滑入滑出
.slide-bottom-enter-active,
.slide-bottom-leave-active {
    transition: transform 0.3s ease-in-out;
}

.slide-bottom-enter-from,
.slide-bottom-leave-to {
    transform: translate(-50%, 100%) !important;
}
</style>
