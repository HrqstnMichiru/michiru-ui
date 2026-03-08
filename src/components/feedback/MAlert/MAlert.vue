<template>
    <Transition name="alert-fade" @before-leave="onBeforeLeave" @leave="onLeave" @after-leave="onAfterLeave">
        <div v-if="visible" class="alert" :class="[`alert--${variant}`, `alert--${effect}`]">
            <!-- 第一行：图标、标题、关闭按钮 -->
            <div class="alert__header">
                <MIcon :name="iconMap[variant]" :size="20" v-if="showIcon"></MIcon>
                <span
                    class="alert__title"
                    :class="{
                        'alert__title--no-title': noTitle
                    }">
                    <template v-if="noTitle">
                        {{ message }}
                    </template>
                    <template v-else>
                        {{ displayTitle }}
                    </template>
                </span>
                <span class="alert__close" v-if="closable" @click="onClose">
                    <MIcon name="ri:close-large-line" :size="16"></MIcon>
                </span>
            </div>
            <!-- 第二行：描述内容 -->
            <div class="alert__message" v-if="!noTitle && (message || slots.default)" :style="{ paddingLeft: showIcon ? '28px' : '0' }">
                <slot>{{ message }}</slot>
            </div>
        </div>
    </Transition>
</template>

<script lang="ts" setup>
import { MIcon } from "@/components";
import { computed, ref, useSlots } from "vue";
import type { MAlertEmits, MAlertProps, MAlertVariant } from "./types";

defineOptions({
    name: "MAlert"
});
const props = withDefaults(defineProps<MAlertProps>(), {
    variant: "primary",
    showIcon: true,
    closable: true,
    effect: "light",
    noTitle: false
});
const emits = defineEmits<MAlertEmits>();
const slots = useSlots();

const visible = ref<boolean>(true);
const iconMap: Record<MAlertVariant, string> = {
    primary: "bi:info-circle-fill",
    success: "ooui:success",
    warning: "streamline:warning-octagon-solid",
    danger: "zondicons:close-solid",
    info: "bi:info-circle-fill"
};
const displayTitle = computed(() => {
    if (props.title) return props.title;
    return props.variant.charAt(0).toUpperCase() + props.variant.slice(1);
});

const onClose = () => {
    visible.value = false;
    emits("after-close");
};
const onBeforeLeave = (el: Element) => {
    (el as HTMLElement).style.height = `${(el as HTMLElement).offsetHeight}px`;
    (el as HTMLElement).style.overflow = "hidden";
};
const onLeave = (el: Element) => {
    (el as HTMLElement).style.height = "0";
    (el as HTMLElement).style.paddingTop = "0";
    (el as HTMLElement).style.paddingBottom = "0";
    (el as HTMLElement).style.marginTop = "0";
    (el as HTMLElement).style.marginBottom = "0";
};
const onAfterLeave = (el: Element) => {
    (el as HTMLElement).style.height = "";
    (el as HTMLElement).style.overflow = "";
};
</script>

<style lang="scss" scoped>
.alert {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 12px 16px;
    border-radius: 8px;
    border: 1px solid;
    transition: all 0.3s var(--ease-soft-spring);
    .alert__header {
        display: flex;
        align-items: center;
        gap: 8px;
        .alert__title {
            flex: 1;
            font-weight: 600;
            font-size: 16px;
            line-height: 1.4;
            &.alert__title--no-title {
                font-size: 15px;
                font-weight: 400;
            }
        }
        .alert__close {
            flex-shrink: 0;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 4px;
            border-radius: 20px;
            transition: background-color 0.2s ease;
            &:hover {
                background-color: rgba(0, 0, 0, 0.15);
            }
        }
    }
    .alert__message {
        font-size: 14px;
        opacity: 0.8;
    }

    // Primary 样式
    &.alert--primary {
        &.alert--light {
            background-color: #e9f2ff;
            border-color: #a8c7ff;
            color: #1d4ed8;
        }
        &.alert--dark {
            background-color: #1d4ed8;
            border-color: #1d4ed8;
            color: #ffffff;
        }
    }
    // Success 样式
    &.alert--success {
        &.alert--light {
            background-color: #eafce8;
            border-color: #83d992;
            color: #1a7a3c;
        }
        &.alert--dark {
            background-color: #37b34a;
            border-color: #37b34a;
            color: #ffffff;
        }
    }
    // Warning 样式
    &.alert--warning {
        &.alert--light {
            background-color: #fff9eb;
            border-color: #f2c078;
            color: #b25a00;
        }
        &.alert--dark {
            background-color: #e6a23c;
            border-color: #e6a23c;
            color: #ffffff;
        }
    }
    // Danger 样式
    &.alert--danger {
        &.alert--light {
            background-color: #fde9e8;
            border-color: #f6a09e;
            color: #cc3d2e;
        }

        &.alert--dark {
            background-color: #f44a43;
            border-color: #f44a43;
            color: #ffffff;
        }
    }
    // Info 样式
    &.alert--info {
        &.alert--light {
            background-color: #ecfcff;
            border-color: #7ed3ec;
            color: #0f7490;
        }
        &.alert--dark {
            background-color: #0ea5e9;
            border-color: #0ea5e9;
            color: #ffffff;
        }
    }
}

.alert-fade-enter-active,
.alert-fade-leave-active {
    transition: all 0.3s var(--ease-in-out);
}

.alert-fade-enter-from,
.alert-fade-leave-to {
    opacity: 0;
    transform: scale(0.9) translateY(-15px);
}
</style>
