<template>
    <Teleport to="body">
        <Transition name="fade" @after-enter="onWrapperAfterEnter">
            <div
                v-if="wrapperVisible"
                class="overlay"
                ref="maskRef"
                @click="onMaskClick"
                :class="[
                    `overlay--${maskTheme}`,
                    {
                        'overlay--blurable': blurable
                    }
                ]"
                :style="{
                    zIndex: zIndex,
                    alignItems: center ? 'center' : 'flex-start',
                    paddingTop: !center ? `${top}px` : '0'
                }">
                <Transition :name="transition" @after-leave="onInnerAfterClose">
                    <slot v-if="innerVisible"></slot>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<script lang="ts" setup>
import { ref, useTemplateRef } from "vue";
import type { OverlayEmits, OverlayInstance, OverlayProps } from "./types";

defineOptions({
    name: "MOverlay"
});
const props = withDefaults(defineProps<OverlayProps>(), {
    maskClosable: true,
    maskTheme: "dark",
    zIndex: 500,
    top: 100,
    blurable: true,
    center: false,
    transition: "slide-down",
    lock: true
});
const emits = defineEmits<OverlayEmits>();

// 响应式数据
const wrapperVisible = ref<boolean>(false); // 控制遮罩层显示
const innerVisible = ref<boolean>(false); // 控制对话框显示
const originalOverflow = ref<string>(""); // 保存原始 overflow 值
const maskRef = useTemplateRef<HTMLDivElement>("maskRef");

// 锁定/解锁 body 滚动
const lockBodyScroll = () => {
    if (!props.lock) return;
    originalOverflow.value = document.body.style.overflow;
    document.body.style.overflow = "hidden";
};
const unlockBodyScroll = () => {
    if (!props.lock) return;
    document.body.style.overflow = originalOverflow.value;
};
// 内层窗口关闭后回调
const onInnerAfterClose = () => {
    wrapperVisible.value = false;
    emits("after-close");
};
// 外层遮罩显示后回调
const onWrapperAfterEnter = () => {
    innerVisible.value = true;
};
// 关闭方法
const close = () => {
    innerVisible.value = false;
    unlockBodyScroll();
};
// 打开方法
const open = () => {
    wrapperVisible.value = true;
    lockBodyScroll();
};
const onMaskClick = (event: MouseEvent) => {
    if (props.maskClosable && event.target === maskRef.value) {
        close();
    }
};

defineExpose<OverlayInstance>({
    close,
    open
});
</script>

<style lang="scss" scoped>
.overlay {
    position: fixed;
    inset: 0;
    display: flex;
    justify-content: center;
    &.overlay--no-mask {
        background-color: rgba(255, 255, 255, 0.01);
    }
    &.overlay--light {
        background-color: rgba(255, 255, 255, 0.5);
    }
    &.overlay--dark {
        background-color: rgba(0, 0, 0, 0.5);
    }
    &.overlay--blurable {
        backdrop-filter: blur(10px);
    }
}

// 淡入淡出动画
.fade-enter-active,
.fade-leave-active {
    transition: all 0.3s var(--ease-in-out);
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

// 淡入淡出动画
.fade-translate-enter-active,
.fade-translate-leave-active {
    transition: all 0.3s var(--ease-soft-spring);
}
.fade-translate-enter-from,
.fade-translate-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}

// 下滑动画
.slide-down-enter-active {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.slide-down-leave-active {
    transition: all 0.3s var(--ease-in-out);
}
.slide-down-enter-from {
    opacity: 0;
    transform: translateY(30px) rotate(-5deg);
}
.slide-down-leave-to {
    opacity: 0;
    transform: translateY(30px);
}
</style>
