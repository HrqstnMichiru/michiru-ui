<template>
    <slot></slot>
    <Teleport to="body">
        <template v-for="(placementInstances, placement) in instances" :key="placement">
            <TransitionGroup name="fade-up" tag="div" class="notification-container" :class="[`notification-container--${placement}`]" :style="containerStyle(placement)">
                <template v-for="instance in placementInstances" :key="instance.id">
                    <div
                        class="notification"
                        :class="[`notification--${instance.variant}`]"
                        @mouseenter="() => clearTimer(instance.id)"
                        @mouseleave="() => startTimer(placement, instance.id, instance.duration!)">
                        <!-- 第一行：图标、标题、关闭按钮 -->
                        <div class="notification__header">
                            <MIcon :name="iconMap[instance.variant!]" :size="20" v-if="instance.showIcon"></MIcon>
                            <span class="notification__title">{{ instance.title || capitalize(instance.variant!) }}</span>
                            <span class="notification__close" v-if="instance.showClose" @click="destroyNotification(placement as NotificationPlacement, instance.id)">
                                <MIcon name="material-symbols:close" :size="18"></MIcon>
                            </span>
                        </div>
                        <!-- 第二行：描述内容 -->
                        <div
                            class="notification__message"
                            v-if="instance.message"
                            :style="{
                                paddingLeft: instance.showIcon ? '28px' : ''
                            }">
                            {{ instance.message }}
                        </div>
                    </div>
                </template>
            </TransitionGroup>
        </template>
    </Teleport>
</template>

<script lang="ts" setup>
import { MIcon } from "@/components";
import { nanoid } from "nanoid";
import type { ShallowReactive } from "vue";
import { provide, shallowReactive } from "vue";
import type { _NotificationInstance, _NotificationOptions, NotificationPlacement, NotificationProviderContext, NotificationProviderProps, NotificationVariant } from "./types";
import { NotificationProviderContextKey } from "./types";

defineOptions({
    name: "MNotificationProvider"
});
const props = withDefaults(defineProps<NotificationProviderProps>(), {
    zIndex: 2000,
    offset: 20,
    duration: 4500,
    gap: 20,
    maxCount: 5
});

const instances: Record<NotificationPlacement, ShallowReactive<_NotificationInstance[]>> = {
    "top-right": shallowReactive([]),
    "top-left": shallowReactive([]),
    "bottom-right": shallowReactive([]),
    "bottom-left": shallowReactive([])
};
const timerMap = shallowReactive<Map<string, any>>(new Map());
const iconMap: Record<NotificationVariant, string> = {
    primary: "bi:info-circle-fill",
    success: "ooui:success",
    warning: "streamline:warning-octagon-solid",
    danger: "zondicons:close-solid",
    info: "bi:info-circle-fill"
};
const offsetX = Array.isArray(props.offset) ? props.offset[0] : props.offset;
const offsetY = Array.isArray(props.offset) ? props.offset[1] : props.offset;
const containerStyle = (placement: NotificationPlacement) => {
    const style: Record<string, string> = {
        zIndex: `${props.zIndex}`,
        gap: `${props.gap}px`,
        height: `calc(100vh - ${offsetY! * 2}px)`,
        top: `${offsetY}px`
    };
    switch (placement) {
        case "top-right":
            style.right = `${offsetX}px`;
            style.alignItems = "flex-end";
            style.justifyContent = "flex-start";
            break;
        case "top-left":
            style.left = `${offsetX}px`;
            style.alignItems = "flex-start";
            style.justifyContent = "flex-start";
            break;
        case "bottom-right":
            style.right = `${offsetX}px`;
            style.alignItems = "flex-end";
            style.justifyContent = "flex-end";
            break;
        case "bottom-left":
            style.left = `${offsetX}px`;
            style.alignItems = "flex-start";
            style.justifyContent = "flex-end";
            break;
    }
    return style;
};
const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const createNotification = (options: _NotificationOptions): _NotificationInstance => {
    const placement = options.placement || "top-right";
    if (instances[placement].length >= props.maxCount) {
        // 超出最大数量限制，销毁最旧的通知
        const oldest = instances[placement].shift();
        if (oldest) {
            clearTimer(oldest.id);
        }
    }
    const id = Date.now().toString() + nanoid(6);
    const duration = options.duration ?? props.duration;
    const instance: _NotificationInstance = {
        showIcon: true,
        showClose: true,
        ...options,
        id,
        duration,
        onDestroy: () => destroyNotification(placement, id),
        zIndex: instances[placement].length * 10
    };
    if (placement === "top-right" || placement === "top-left") {
        instances[placement].push(instance);
    } else {
        instances[placement].unshift(instance);
    }
    startTimer(placement, id, duration);
    return instance;
};
const destroyNotification = (placement: NotificationPlacement, id: string) => {
    const placementInstances = instances[placement];
    const index = placementInstances.findIndex(inst => inst.id === id);
    if (index === -1) return;
    placementInstances.splice(index, 1);
};
const startTimer = (placement: NotificationPlacement, id: string, duration: number) => {
    if (duration === 0) return;
    const timer = setTimeout(() => {
        destroyNotification(placement, id);
    }, duration);
    timerMap.set(id, timer);
};
const clearTimer = (id: string) => {
    const timer = timerMap.get(id);
    if (timer) {
        clearTimeout(timer);
        timerMap.delete(id);
    }
};

provide<NotificationProviderContext>(NotificationProviderContextKey, {
    create: createNotification,
    primary: (message: string, options?: Omit<_NotificationOptions, "message" | "variant">) => createNotification({ ...options, message, variant: "primary" }),
    success: (message: string, options?: Omit<_NotificationOptions, "message" | "variant">) => createNotification({ ...options, message, variant: "success" }),
    warning: (message: string, options?: Omit<_NotificationOptions, "message" | "variant">) => createNotification({ ...options, message, variant: "warning" }),
    info: (message: string, options?: Omit<_NotificationOptions, "message" | "variant">) => createNotification({ ...options, message, variant: "info" }),
    danger: (message: string, options?: Omit<_NotificationOptions, "message" | "variant">) => createNotification({ ...options, message, variant: "danger" }),
    destroyAll: () => {
        (Object.keys(instances) as NotificationPlacement[]).forEach(placement => {
            instances[placement].splice(0, instances[placement].length);
        });
        timerMap.forEach(timer => clearTimeout(timer));
        timerMap.clear();
    }
});
</script>

<style lang="scss" scoped>
.notification-container {
    position: fixed;
    display: flex;
    flex-direction: column;
    pointer-events: none;
    width: 450px;
    .notification {
        flex-shrink: 0;
        pointer-events: auto;
        will-change: transform, opacity;
        min-width: 320px;
        max-width: 400px;
        border-radius: 8px;
        padding: 12px 16px;
        display: flex;
        flex-direction: column;
        box-shadow: 0 0 12px rgba(0, 0, 0, 0.12);
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
            line-height: 1.6;
            opacity: 0.75;
            white-space: wrap;
            word-break: break-word;
        }
    }
}

// 过渡动画
.fade-up-enter-active,
.fade-up-leave-active,
.fade-up-move {
    transition: all 0.3s ease;
}

.fade-up-enter-from,
.fade-up-leave-to {
    opacity: 0;
}

.fade-up-leave-active {
    position: absolute;
}

// 右侧进入的动画
.notification-container--top-right,
.notification-container--bottom-right {
    .fade-up-enter-from,
    .fade-up-leave-to {
        transform: translateX(100%);
    }
}

// 左侧进入的动画
.notification-container--top-left,
.notification-container--bottom-left {
    .fade-up-enter-from,
    .fade-up-leave-to {
        transform: translateX(-100%);
    }
}
</style>
