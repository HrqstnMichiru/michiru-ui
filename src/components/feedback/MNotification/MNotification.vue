<template>
    <Transition name="notification-fade" @after-leave="onAfterLeave" appear>
        <div
            v-if="visible"
            class="notification"
            :class="[`notification--${variant}`, `notification--${placement}`]"
            :style="cssStyle"
            ref="notificationRef"
            @mouseenter="clearTimer"
            @mouseleave="startTimer">
            <!-- 第一行：图标、标题、关闭按钮 -->
            <div class="notification__header">
                <MIcon :name="iconMap[props.variant]" :size="20" v-if="showIcon"></MIcon>
                <span class="notification__title">{{ displayTitle }}</span>
                <span class="notification__close" v-if="showClose" @click="visible = false">
                    <MIcon name="material-symbols:close" :size="18"></MIcon>
                </span>
            </div>
            <!-- 第二行：描述内容 -->
            <div
                class="notification__message"
                v-if="message"
                :style="{
                    paddingLeft: showIcon ? '28px' : ''
                }">
                {{ message }}
            </div>
        </div>
    </Transition>
</template>

<script lang="ts" setup>
import { MIcon } from "@/components";
import { computed, nextTick, onMounted, onUnmounted, ref, useTemplateRef } from "vue";
import type { MNotificationProps, MNotificationVariant } from "./types";
import { getLastOffset } from "./utils";

defineOptions({
    name: "MNotification"
});
const props = withDefaults(defineProps<MNotificationProps>(), {
    variant: "primary",
    duration: 4500,
    showClose: true,
    showIcon: true,
    offset: 20,
    placement: "top-right"
});

const visible = ref<boolean>(true);
const notificationRef = useTemplateRef<HTMLDivElement>("notificationRef");
const displayTitle = computed(() => {
    if (props.title) return props.title;
    return props.variant.charAt(0).toUpperCase() + props.variant.slice(1);
});
const offsetX = Array.isArray(props.offset) ? props.offset[0] : props.offset;
const baseOffsetY = Array.isArray(props.offset) ? props.offset[1] : props.offset;
const height = ref<number>(0);
const lastOffset = computed(() => getLastOffset(props.placement, props.id));
const offsetY = computed(() => {
    return baseOffsetY! + lastOffset.value;
});
const extraOffsetY = computed(() => {
    return offsetY.value + height.value;
});
const cssStyle = computed(() => {
    const baseStyle: Record<string, string> = {
        zIndex: `${props.zIndex}`
    };
    switch (props.placement) {
        case "top-right":
            baseStyle.top = `${offsetY.value}px`;
            baseStyle.right = `${offsetX}px`;
            break;
        case "top-left":
            baseStyle.top = `${offsetY.value}px`;
            baseStyle.left = `${offsetX}px`;
            break;
        case "bottom-right":
            baseStyle.bottom = `${offsetY.value}px`;
            baseStyle.right = `${offsetX}px`;
            break;
        case "bottom-left":
            baseStyle.bottom = `${offsetY.value}px`;
            baseStyle.left = `${offsetX}px`;
            break;
    }
    return baseStyle;
});
const iconMap: Record<MNotificationVariant, string> = {
    primary: "bi:info-circle-fill",
    success: "ooui:success",
    warning: "streamline:warning-octagon-solid",
    danger: "zondicons:close-solid",
    info: "bi:info-circle-fill"
};

const onAfterLeave = () => {
    props.onDestroy();
};

let timer: any = null;
const startTimer = () => {
    if (props.duration === 0) return;
    timer = setTimeout(() => {
        visible.value = false;
    }, props.duration);
};

const clearTimer = () => {
    if (timer) {
        clearTimeout(timer);
        timer = null;
    }
};

onMounted(() => {
    nextTick(() => {
        if (notificationRef.value) {
            height.value = notificationRef.value.getBoundingClientRect().height;
        }
    });
    startTimer();
});
onUnmounted(() => {
    clearTimer();
});

defineExpose({
    extraOffsetY
});
</script>

<style lang="scss" scoped>
.notification {
    position: fixed;
    min-width: 320px;
    max-width: 400px;
    border-radius: 8px;
    padding: 12px 16px;
    display: flex;
    transition: all 0.3s ease;
    flex-direction: column;
    box-shadow: 6px 6px 12px rgba(0, 0, 0, 0.15);
    user-select: none;

    // Primary 样式
    &.notification--primary {
        background: linear-gradient(135deg, #e9f2ff 0%, #d8e8ff 100%);
        border: 1px solid #a8c7ff;
        color: #1d4ed8;
    }
    // Success 样式
    &.notification--success {
        background: linear-gradient(135deg, #e9f7ef 0%, #d6f0e1 100%);
        border: 1px solid #8fd4aa;
        color: #1c7a3f;
    }
    // Warning 样式
    &.notification--warning {
        background: linear-gradient(135deg, #fff9eb 0%, #ffe8c7 100%);
        border: 1px solid #f2c078;
        color: #b25a00;
    }
    // Danger 样式
    &.notification--danger {
        background: linear-gradient(135deg, #ffe9ed 0%, #ffd4dc 100%);
        border: 1px solid #f39aa6;
        color: #c0273a;
    }
    // Info 样式
    &.notification--info {
        background: linear-gradient(135deg, #ecfcff 0%, #d9f3f8 100%);
        border: 1px solid #7ed3ec;
        color: #0f7490;
    }

    .notification__header {
        display: flex;
        align-items: center;
        gap: 8px;
        .notification__title {
            flex: 1;
            font-weight: 500;
            font-size: 15px;
            line-height: 1.4;
        }
        .notification__close {
            flex-shrink: 0;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 3px;
            border-radius: 20px;
            transition: background-color 0.2s ease;
            &:hover {
                background-color: rgba(0, 0, 0, 0.2);
            }
        }
    }
    .notification__message {
        font-size: 13px;
        white-space: wrap;
        word-break: break-word;
        line-height: 1.6;
        opacity: 0.75;
    }
}

.notification-fade-enter-active,
.notification-fade-leave-active {
    transition: all 0.3s ease;
}

.notification-fade-enter-from,
.notification-fade-leave-to {
    opacity: 0;
}

.notification--top-right.notification-fade-enter-from,
.notification--top-right.notification-fade-leave-to {
    transform: translateX(100%);
}

.notification--top-left.notification-fade-enter-from,
.notification--top-left.notification-fade-leave-to {
    transform: translateX(-100%);
}

.notification--bottom-right.notification-fade-enter-from,
.notification--bottom-right.notification-fade-leave-to {
    transform: translateX(100%);
}

.notification--bottom-left.notification-fade-enter-from,
.notification--bottom-left.notification-fade-leave-to {
    transform: translateX(-100%);
}
</style>
