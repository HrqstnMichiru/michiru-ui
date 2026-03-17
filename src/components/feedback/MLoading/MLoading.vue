<template>
    <Teleport :to="target">
        <Transition name="fade" @after-leave="onAfterLeave">
            <div
                v-if="visible"
                class="m-loading-wrapper"
                :class="{
                    'is-fullscreen': fullScreen
                }">
                <div class="m-loading">
                    <span class="m-loading-item"></span>
                    <span class="m-loading-item"></span>
                    <span class="m-loading-item"></span>
                    <span class="m-loading-item"></span>
                    <span class="m-loading-item"></span>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import type { MLoadingProps } from "./types";

defineOptions({
    name: "MLoading"
});
const props = withDefaults(defineProps<MLoadingProps>(), {
    target: "body"
});

const visible = ref(true);
const fullScreen = computed(() => props.target === "body" || props.target === document.body);
const onAfterLeave = () => {
    props.onDestroy();
};

const getTargetElement = (): HTMLElement | null => {
    if (props.target instanceof HTMLElement) return props.target;
    if (typeof props.target === "string") {
        return document.querySelector(props.target) as HTMLElement | null;
    }
    return null;
};

const lockTarget = ref<HTMLElement | null>(null);
const originalOverflow = ref<string>("");
const lockScroll = () => {
    const targetElement = getTargetElement();
    if (!targetElement) return;
    lockTarget.value = targetElement;
    originalOverflow.value = targetElement.style.overflow;
    targetElement.style.overflow = "hidden";
};
const unlockScroll = () => {
    if (!lockTarget.value) return;
    lockTarget.value.style.overflow = originalOverflow.value;
    lockTarget.value = null;
};
onMounted(() => {
    lockScroll();
});
onBeforeUnmount(() => {
    unlockScroll();
});

defineExpose({
    close: () => {
        visible.value = false;
    }
});
</script>

<style lang="scss" scoped>
.m-loading-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    background-color: #fff;
    position: absolute;
    z-index: 9999;
    inset: 0;
    &.is-fullscreen {
        position: fixed;
    }
    .m-loading {
        display: flex;
        position: relative;
        width: 170px;
        height: 20px;
        padding: 0 15px;
        gap: 10px;
        .m-loading-item {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            animation: loader 1.4s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
            &:nth-child(1) {
                animation-delay: 0s;
                background-color: #f0555a;
            }
            &:nth-child(2) {
                animation-delay: 0.08s;
                background-color: #2a96fa;
            }
            &:nth-child(3) {
                animation-delay: 0.16s;
                background-color: #00b4aa;
            }
            &:nth-child(4) {
                animation-delay: 0.24s;
                background-color: #ffe76c;
            }
            &:nth-child(5) {
                animation-delay: 0.32s;
                background-color: #7a5668;
            }
        }
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 1.2s cubic-bezier(0.5, 1, 0.89, 1);
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

@keyframes loader {
    0% {
        transform: translateY(0);
    }
    5% {
        transform: translateY(4px);
        filter: blur(0.1px);
        margin-left: -2px;
        width: 24px;
        height: 16px;
    }
    10% {
        transform: translateY(4px);
        filter: blur(0.1px);
        margin-left: -1px;
        width: 22px;
        height: 18px;
    }
    15% {
        transform: translateY(-17px);
        filter: blur(0.3px);
        margin-left: 1px;
        width: 18px;
        height: 22px;
    }
    22% {
        transform: translateY(-34px);
        filter: blur(0.2px);
        margin-left: 0;
        width: 20px;
        height: 20px;
    }
    29% {
        transform: translateY(-17px);
        filter: blur(0.3px);
        margin-left: 1px;
        width: 18px;
        height: 22px;
    }
    34% {
        transform: translateY(0);
        filter: blur(0.2px);
        margin-left: 1px;
        width: 18px;
        height: 22px;
    }
    40% {
        transform: translateY(0);
        filter: blur(0.1px);
        margin-left: -1px;
        width: 22px;
        height: 18px;
    }
    43% {
        transform: translateY(0);
        filter: blur(0px);
        margin-left: 0;
        width: 20px;
        height: 20px;
    }
    100% {
        transform: translateY(0);
        margin-left: 0;
    }
}
</style>
