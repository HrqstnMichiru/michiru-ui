<template>
    <Transition name="fade-up" @after-leave="onAfterLeave" appear>
        <div v-if="visible" class="message" :class="[`message--${variant}`]" :style="cssStyle" ref="messageRef" @mouseenter="clearTimer" @mouseleave="startTimer">
            <MIcon :name="iconMap[props.variant]" :size="20" class="message-icon"></MIcon>
            <span>{{ message }}</span>
            <span class="message__close" @click="visible = false" v-if="showClose">
                <MIcon name="material-symbols:close" :size="18"></MIcon>
            </span>
        </div>
    </Transition>
</template>

<script lang="ts" setup>
import { MIcon } from "@/components";
import { computed, nextTick, onMounted, onUnmounted, ref, useTemplateRef } from "vue";
import type { MMessageProps, MMessageVariant } from "./types";
import { getLastBottomOffset } from "./utils";

defineOptions({
    name: "MMessage"
});

const props = withDefaults(defineProps<MMessageProps>(), {
    duration: 3000,
    showClose: false,
    variant: "primary",
    offset: 20
});

const visible = ref<boolean>(true);
const messageRef = useTemplateRef<HTMLDivElement>("messageRef");
// 当前div的高度
const height = ref<number>(0);
// 上一个消息的底部偏移量
const lastOffset = computed(() => getLastBottomOffset(props.id));
// 计算当前消息的顶部偏移量
const topOffset = computed(() => {
    return props.offset + lastOffset.value;
});
// 计算当前消息的底部偏移量
const bottomOffset = computed(() => {
    return topOffset.value + height.value;
});
const cssStyle = computed(() => {
    return {
        top: `${topOffset.value}px`,
        zIndex: props.zIndex
    };
});
const iconMap: Record<MMessageVariant, string> = {
    primary: "bi:info-circle-fill",
    success: "ooui:success",
    warning: "streamline:warning-octagon-solid",
    danger: "zondicons:close-solid",
    info: "bi:info-circle-fill",
    purple: "bi:info-circle-fill",
    pink: "bi:info-circle-fill"
};
const icon = computed(() => {
    return iconMap[props.variant] || iconMap["primary"];
});

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
        if (messageRef.value) {
            height.value = messageRef.value.getBoundingClientRect().height;
        }
    });
    startTimer();
});
onUnmounted(() => {
    clearTimer();
});

defineExpose({
    bottomOffset
});
</script>

<style lang="scss" scoped>
.message {
    user-select: none;
    width: fit-content;
    border-radius: 8px;
    position: fixed;
    left: 50%;
    transition: all 0.3s ease;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 500;

    // Primary 样式
    &.message--primary {
        background: linear-gradient(135deg, #e9f2ff 0%, #d8e8ff 100%);
        border: 1px solid #a8c7ff;
        color: #1d4ed8;
        box-shadow: 0 10px 24px rgba(33, 99, 255, 0.16);
    }
    // 警告样式
    &.message--warning {
        background: linear-gradient(135deg, #fff9eb 0%, #ffe8c7 100%);
        border: 1px solid #f2c078;
        color: #b25a00;
        box-shadow: 0 10px 24px rgba(255, 179, 71, 0.24);
    }
    // 成功样式
    &.message--success {
        background: linear-gradient(135deg, #e9f7ef 0%, #d6f0e1 100%);
        border: 1px solid #8fd4aa;
        color: #1c7a3f;
        box-shadow: 0 10px 24px rgba(46, 204, 113, 0.16);
    }
    // 危险样式
    &.message--danger {
        background: linear-gradient(135deg, #ffe9ed 0%, #ffd4dc 100%);
        border: 1px solid #f39aa6;
        color: #c0273a;
        box-shadow: 0 10px 24px rgba(236, 72, 117, 0.16);
    }
    // 信息样式 - 青色
    &.message--info {
        background: linear-gradient(135deg, #ecfcff 0%, #d9f3f8 100%);
        border: 1px solid #7ed3ec;
        color: #0f7490;
        box-shadow: 0 10px 24px rgba(14, 165, 233, 0.16);
    }
    // 紫色样式
    &.message--purple {
        background: linear-gradient(135deg, #f4f0ff 0%, #e2d8ff 100%);
        border: 1px solid #b9a6ff;
        color: #6d28d9;
        box-shadow: 0 10px 24px rgba(109, 40, 217, 0.16);
    }
    // 粉色样式
    &.message--pink {
        background: linear-gradient(135deg, #fff0f7 0%, #ffd9ec 100%);
        border: 1px solid #f6a6c2;
        color: #c2185b;
        box-shadow: 0 10px 24px rgba(244, 114, 182, 0.16);
    }
    .message-icon {
        margin-right: 8px;
    }
    .message__close {
        margin-left: 12px;
        cursor: pointer;
        padding: 5px;
        border-radius: 20px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s ease;
        &:hover {
            background-color: rgba(0, 0, 0, 0.2);
        }
    }
}

.fade-up-enter-active,
.fade-up-leave-active {
    transition: all 0.3s ease;
}

.fade-up-enter-from,
.fade-up-leave-to {
    opacity: 0 !important;
    transform: translate(-50%, -100%) !important;
}

.fade-up-enter-to,
.fade-up-leave-from {
    opacity: 1;
    transform: translateX(-50%);
}
</style>
