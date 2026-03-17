<template>
    <Teleport to="body">
        <Transition name="fade">
            <div
                v-if="wrapperVisible"
                class="overlay"
                @click="onMaskClick"
                :style="{
                    zIndex: zIndex,
                    alignItems: center ? 'center' : 'flex-start',
                    paddingTop: !center ? `${top}px` : '0'
                }">
                <Transition :name="transition" appear @after-leave="onAfterLeave">
                    <slot v-if="innerVisible"></slot>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<script lang="ts" setup>
import { ref, useTemplateRef } from "vue";
import type { MOverlayEmits, MOverlayInstance, MOverlayProps } from "./types";

defineOptions({
    name: "MOverlay"
});
const props = withDefaults(defineProps<MOverlayProps>(), {
    maskClosable: true,
    zIndex: 500,
    top: 100,
    center: false,
    transition: "slide-down"
});
const emits = defineEmits<MOverlayEmits>();

const wrapperVisible = ref(false);
const innerVisible = ref(false);
const originalOverflow = ref<string>("");
const maskRef = useTemplateRef<HTMLDivElement>("maskRef");

const lockBodyScroll = () => {
    originalOverflow.value = document.body.style.overflow;
    document.body.style.overflow = "hidden";
};
const unlockBodyScroll = () => {
    document.body.style.overflow = originalOverflow.value;
};

let hideWrapperRafId: number | null = null;
const close = () => {
    innerVisible.value = false;
    if (hideWrapperRafId !== null) {
        cancelAnimationFrame(hideWrapperRafId);
    }
    hideWrapperRafId = requestAnimationFrame(() => {
        wrapperVisible.value = false;
        hideWrapperRafId = null;
    });
    unlockBodyScroll();
};
const open = () => {
    wrapperVisible.value = true;
    innerVisible.value = true;
    lockBodyScroll();
};
const onAfterLeave = () => {
    emits("after-close");
};

const onMaskClick = () => {
    if (!props.maskClosable) return;
    close();
};

defineExpose<MOverlayInstance>({
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
    background-color: rgba(0, 0, 0, 0.5);
}

// 淡入淡出动画
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s cubic-bezier(0.55, 0, 0.1, 1);
    will-change: opacity;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

// 淡入淡出动画
.fade-translate-enter-active,
.fade-translate-leave-active {
    transition:
        opacity 0.3s cubic-bezier(0.55, 0, 0.1, 1),
        transform 0.3s cubic-bezier(0.55, 0, 0.1, 1);
    will-change: opacity, transform;
}
.fade-translate-enter-from,
.fade-translate-leave-to {
    opacity: 0;
    transform: translate3d(0, -20px, 0);
}
.fade-translate-enter-to,
.fade-translate-leave-from {
    opacity: 1;
    transform: translate3d(0, 0, 0);
}

// 下滑动画
.slide-down-enter-active {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s;
}
.slide-down-leave-active {
    transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
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
