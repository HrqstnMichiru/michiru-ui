<template>
    <slot></slot>
    <Teleport to="body">
        <TransitionGroup name="fade-up" tag="div" class="message-container" :style="{ top: `${offset}px`, zIndex: zIndex, gap: `${gap}px` }">
            <div
                v-for="instance in instances"
                :key="instance.id"
                class="message"
                :class="[`message--${instance.variant}`]"
                @mouseenter="() => clearTimer(instance.id)"
                @mouseleave="() => startTimer(instance.id, instance.duration!)">
                <MIcon :name="iconMap[instance.variant || 'primary']" :size="20" class="message-icon"></MIcon>
                <span>{{ instance.message }}</span>
                <span class="message__close" v-if="instance.showClose" @click="() => destroyMessage(instance.id)">
                    <MIcon name="material-symbols:close" :size="18"></MIcon>
                </span>
            </div>
        </TransitionGroup>
    </Teleport>
</template>

<script lang="ts" setup>
import { MIcon } from "@/components";
import { nanoid } from "nanoid";
import { provide, shallowReactive } from "vue";
import type { _MessageInstance, _MessageOptions, MessageProviderContext, MessageProviderProps, MessageVariant } from "./types";
import { MessageProviderContextKey } from "./types";

defineOptions({
    name: "MMessageProvider"
});
const props = withDefaults(defineProps<MessageProviderProps>(), {
    duration: 3000,
    maxCount: 5,
    offset: 20,
    zIndex: 9999,
    gap: 20
});

const instances = shallowReactive<_MessageInstance[]>([]);
const timerMap = shallowReactive<Map<string, any>>(new Map());
const iconMap: Record<MessageVariant, string> = {
    primary: "bi:info-circle-fill",
    success: "ooui:success",
    warning: "streamline:warning-octagon-solid",
    danger: "zondicons:close-solid",
    info: "bi:info-circle-fill",
    pink: "bi:info-circle-fill",
    purple: "bi:info-circle-fill"
};

const createMessage = (options: _MessageOptions): _MessageInstance => {
    if (instances.length >= props.maxCount) {
        // 如果超过最大数量，销毁最早的一个实例
        const oldest = instances.shift();
        if (oldest) {
            clearTimer(oldest.id);
        }
    }
    const id = Date.now().toString() + nanoid(6);
    const duration = options.duration ?? props.duration;
    const instance: _MessageInstance = {
        ...options,
        id,
        duration,
        onDestroy: () => destroyMessage(id),
        zIndex: instances.length * 10
    };
    instances.push(instance);
    startTimer(id, duration);
    return instance;
};
const destroyMessage = (id: string) => {
    const index = instances.findIndex(inst => inst.id === id);
    if (index === -1) return;
    instances.splice(index, 1);
};
const startTimer = (id: string, duration: number) => {
    if (duration === 0) return;
    const timer = setTimeout(() => {
        destroyMessage(id);
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

provide<MessageProviderContext>(MessageProviderContextKey, {
    create: createMessage,
    primary(message: string, props: Omit<_MessageOptions, "variant" | "message"> = {}) {
        return createMessage({ ...props, message, variant: "primary" });
    },
    success(message: string, props: Omit<_MessageOptions, "variant" | "message"> = {}) {
        return createMessage({ ...props, message, variant: "success" });
    },
    warning(message: string, props: Omit<_MessageOptions, "variant" | "message"> = {}) {
        return createMessage({ ...props, message, variant: "warning" });
    },
    danger(message: string, props: Omit<_MessageOptions, "variant" | "message"> = {}) {
        return createMessage({ ...props, message, variant: "danger" });
    },
    info(message: string, props: Omit<_MessageOptions, "variant" | "message"> = {}) {
        return createMessage({ ...props, message, variant: "info" });
    },
    purple(message: string, props: Omit<_MessageOptions, "variant" | "message"> = {}) {
        return createMessage({ ...props, message, variant: "purple" });
    },
    pink(message: string, props: Omit<_MessageOptions, "variant" | "message"> = {}) {
        return createMessage({ ...props, message, variant: "pink" });
    },
    destroyAll() {
        instances.splice(0, instances.length);
        timerMap.forEach(timer => clearTimeout(timer));
        timerMap.clear();
    }
});
</script>

<style lang="scss" scoped>
.message-container {
    position: fixed;
    left: 0;
    right: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    pointer-events: none;
    .message {
        white-space: nowrap;
        flex-shrink: 0;
        pointer-events: auto;
        will-change: transform, opacity;
        user-select: none;
        width: fit-content;
        border-radius: 8px;
        display: flex;
        align-items: center;
        padding: 12px 16px;
        box-shadow: 0 0 12px rgba(0, 0, 0, 0.12);
        font-size: 14px;
        font-weight: 500;
        &.message--primary {
            background: linear-gradient(135deg, #e9f2ff 0%, #d8e8ff 100%);
            border: 1px solid #a8c7ff;
            color: #1d4ed8;
            box-shadow: 0 10px 24px rgba(33, 99, 255, 0.16);
        }
        &.message--warning {
            background: linear-gradient(135deg, #fff9eb 0%, #ffe8c7 100%);
            border: 1px solid #f2c078;
            color: #b25a00;
            box-shadow: 0 10px 24px rgba(255, 179, 71, 0.24);
        }
        &.message--success {
            background: linear-gradient(135deg, #e9f7ef 0%, #d6f0e1 100%);
            border: 1px solid #8fd4aa;
            color: #1c7a3f;
            box-shadow: 0 10px 24px rgba(46, 204, 113, 0.16);
        }
        &.message--danger {
            background: linear-gradient(135deg, #ffe9ed 0%, #ffd4dc 100%);
            border: 1px solid #f39aa6;
            color: #c0273a;
            box-shadow: 0 10px 24px rgba(236, 72, 117, 0.16);
        }
        &.message--info {
            background: linear-gradient(135deg, #ecfcff 0%, #d9f3f8 100%);
            border: 1px solid #7ed3ec;
            color: #0f7490;
            box-shadow: 0 10px 24px rgba(14, 165, 233, 0.16);
        }
        &.message--purple {
            background: linear-gradient(135deg, #f4f0ff 0%, #e2d8ff 100%);
            border: 1px solid #b9a6ff;
            color: #6d28d9;
            box-shadow: 0 10px 24px rgba(109, 40, 217, 0.16);
        }
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
            padding: 3px;
            border-radius: 20px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background-color 0.2s ease;
            &:hover {
                background-color: rgba(0, 0, 0, 0.2);
            }
        }
    }
}

.fade-up-enter-active,
.fade-up-leave-active {
    transition: all 0.3s ease;
}

.fade-up-leave-active {
    position: absolute;
}

.fade-up-move {
    transition: transform 0.3s ease;
}

.fade-up-enter-from,
.fade-up-leave-to {
    opacity: 0 !important;
    transform: translateY(-100%) !important;
}
</style>
