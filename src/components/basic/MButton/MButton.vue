<template>
    <button
        :class="[
            'm-btn',
            `m-btn--${size}`,
            `m-btn--${variant}`,
            {
                'm-btn--round': round,
                'm-btn--circle': circle,
                'm-btn--outline': outline,
                'm-btn--plain': plain,
                'm-btn--disabled': disabled,
                'm-btn--block': block,
                'm-btn--in-group': buttonGroupContext,
                'm-btn--in-group-vertical': buttonGroupContext && buttonGroupContext.vertical,
                'm-btn--loading': loading
            }
        ]"
        :disabled="disabled"
        type="button"
        @click="onClick"
        v-ripple="!disabled && !loading && !outline">
        <div class="m-btn__prefix" :class="{ 'is-loading': loading || icon }">
            <svg viewBox="0 0 16 16" v-if="loading" class="loading-circle">
                <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" stroke-width="1.5" pathLength="100" />
            </svg>
            <MIcon v-else-if="icon" :name="icon" />
        </div>
        <!-- 文本内容 -->
        <span
            v-if="slots.default || text"
            class="m-btn__content"
            :style="{
                marginLeft: loading || icon ? '5px' : '0'
            }">
            <slot>{{ text }}</slot>
        </span>
    </button>
</template>

<script lang="ts" setup>
import { MIcon } from "@/components";
import vRipple from "@/directives/ripple";
import { computed, inject, useSlots } from "vue";
import type { MButtonEmits, MButtonGroupContext, MButtonProps } from "./types";
import { MButtonGroupContextKey } from "./types";

defineOptions({
    name: "MButton"
});
const props = withDefaults(defineProps<MButtonProps>(), {
    size: "medium",
    variant: "primary",
    shape: "default",
    plain: false,
    disabled: false,
    block: false,
    loading: false,
    ripple: true
});
const slots = useSlots();
const emits = defineEmits<MButtonEmits>();
const buttonGroupContext = inject<MButtonGroupContext | null>(MButtonGroupContextKey, null);

const size = computed(() => {
    return buttonGroupContext?.size || props.size;
});
const disabled = computed(() => {
    return buttonGroupContext?.disabled === undefined ? props.disabled : buttonGroupContext.disabled;
});
const variant = computed(() => {
    return buttonGroupContext?.variant || props.variant;
});
const plain = computed(() => {
    return buttonGroupContext?.plain === undefined ? props.plain : buttonGroupContext.plain;
});
const outline = computed(() => {
    return buttonGroupContext?.outline === undefined ? props.outline : buttonGroupContext.outline;
});

const onClick = () => {
    if (disabled.value || props.loading) {
        return;
    }
    emits("click");
};
</script>

<style lang="scss" scoped>
.m-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid transparent;
    white-space: nowrap;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s var(--ease-in-out);
    position: relative;
    user-select: none;
    overflow: hidden;
    .m-btn__prefix {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition:
            width 0.3s var(--ease-in-out),
            opacity 0.2s var(--ease-in-out);
        overflow: hidden;
        width: 0;
        opacity: 0;
        .loading-circle {
            display: inline-block;
            transform: rotate(90deg);
            animation: loading-rotate 2s linear infinite;
            circle {
                transform-origin: center;
                stroke-linecap: round;
                animation: loading-stretch 1.5s ease-in-out infinite;
            }
        }
    }

    // 小尺寸
    &.m-btn--small {
        padding: 5.2px 7.2px;
        height: 28px;
        border-radius: 4px;
        .m-btn__prefix {
            font-size: 16px;
            &.is-loading {
                width: 16px;
                opacity: 1;
            }
            .m-btn-loading {
                width: 16px;
                height: 16px;
            }
        }
        .m-btn__content {
            font-size: 14px;
            line-height: 16px;
        }
    }
    // 中等尺寸
    &.m-btn--medium {
        padding: 7.2px 9.2px;
        height: 34px;
        border-radius: 6px;
        .m-btn__prefix {
            font-size: 18px;
            &.is-loading {
                width: 18px;
                opacity: 1;
            }
            .m-btn-loading {
                width: 18px;
                height: 18px;
            }
        }
        .m-btn__content {
            font-size: 15px;
            line-height: 18px;
        }
    }
    // 大尺寸
    &.m-btn--large {
        padding: 9.2px 11.2px;
        height: 40px;
        border-radius: 8px;
        .m-btn__prefix {
            font-size: 20px;
            &.is-loading {
                width: 20px;
                opacity: 1;
            }
            .m-btn-loading {
                width: 20px;
                height: 20px;
            }
        }
        .m-btn__content {
            font-size: 16px;
            line-height: 20px;
        }
    }

    // 胶囊按钮
    &.m-btn--round {
        border-radius: 20px;
    }

    // 圆形按钮
    &.m-btn--circle {
        border-radius: 50%;
        padding: 0;
        &.m-btn--small {
            width: 28px;
        }
        &.m-btn--medium {
            width: 34px;
        }
        &.m-btn--large {
            width: 40px;
        }
    }

    // 块级按钮
    &.m-btn--block {
        width: 100%;
    }

    // 加载状态
    &.m-btn--loading {
        cursor: wait;
    }

    // 禁用状态
    &.m-btn--disabled {
        cursor: not-allowed !important;
        box-shadow: none;
        pointer-events: none;
    }

    // 水平按钮组
    &.m-btn--in-group:not(.m-btn--in-group-vertical) {
        border-radius: 0;
        &:not(:first-child) {
            margin-left: -1px;
            // 非 plain 样式添加分隔线
            &:not(.m-btn--plain) {
                border-left: 1px solid rgba(255, 255, 255, 0.5);
                &:hover {
                    border-left-color: rgba(255, 255, 255, 0.5);
                }
            }
        }
        &:first-child {
            &.m-btn--small {
                border-top-left-radius: 4px;
                border-bottom-left-radius: 4px;
            }
            &.m-btn--medium {
                border-top-left-radius: 6px;
                border-bottom-left-radius: 6px;
            }
            &.m-btn--large {
                border-top-left-radius: 8px;
                border-bottom-left-radius: 8px;
            }
        }
        &:last-child {
            &.m-btn--small {
                border-top-right-radius: 4px;
                border-bottom-right-radius: 4px;
            }
            &.m-btn--medium {
                border-top-right-radius: 6px;
                border-bottom-right-radius: 6px;
            }
            &.m-btn--large {
                border-top-right-radius: 8px;
                border-bottom-right-radius: 8px;
            }
        }
    }
    // 垂直按钮组
    &.m-btn--in-group-vertical {
        border-radius: 0;
        &:not(:first-child) {
            margin-top: -1px;
            // 非 plain 样式添加分隔线
            &:not(.m-btn--plain) {
                border-top: 1px solid rgba(255, 255, 255, 0.5);
                &:hover {
                    border-top-color: rgba(255, 255, 255, 0.5);
                }
            }
        }
        &:first-child {
            &.m-btn--small {
                border-top-left-radius: 4px;
                border-top-right-radius: 4px;
            }
            &.m-btn--medium {
                border-top-left-radius: 6px;
                border-top-right-radius: 6px;
            }
            &.m-btn--large {
                border-top-left-radius: 8px;
                border-top-right-radius: 8px;
            }
        }
        &:last-child {
            &.m-btn--small {
                border-bottom-left-radius: 4px;
                border-bottom-right-radius: 4px;
            }
            &.m-btn--medium {
                border-bottom-left-radius: 6px;
                border-bottom-right-radius: 6px;
            }
            &.m-btn--large {
                border-bottom-left-radius: 8px;
                border-bottom-right-radius: 8px;
            }
        }
    }

    // 颜色变体 - 实心样式
    &.m-btn--primary {
        background-color: #007bff;
        color: white;
        border-color: #007bff;
        &:hover {
            background-color: #0d6efd;
            border-color: #0d6efd;
            color: white;
        }
        &:active {
            background-color: #0a58ca;
            border-color: #0a58ca;
            color: white;
        }
    }
    &.m-btn--success {
        background-color: #5eb85e;
        color: white;
        border-color: #5eb85e;
        &:hover {
            background-color: #70c670;
            border-color: #70c670;
            color: white;
        }
        &:active {
            background-color: #4ca64c;
            border-color: #4ca64c;
            color: white;
        }
    }
    &.m-btn--warning {
        background-color: #e6a23c;
        color: white;
        border-color: #e6a23c;
        &:hover {
            background-color: #ebb563;
            border-color: #ebb563;
            color: white;
        }
        &:active {
            background-color: #cf9236;
            border-color: #cf9236;
            color: white;
        }
    }
    &.m-btn--danger {
        background-color: #d64545;
        color: white;
        border-color: #d64545;
        &:hover {
            background-color: #e25656;
            border-color: #e25656;
            color: white;
        }
        &:active {
            background-color: #c43434;
            border-color: #c43434;
            color: white;
        }
    }
    &.m-btn--info {
        background-color: #36b5b5;
        color: white;
        border-color: #36b5b5;
        &:hover {
            background-color: #47c3c3;
            border-color: #47c3c3;
            color: white;
        }
        &:active {
            background-color: #25a3a3;
            border-color: #25a3a3;
            color: white;
        }
    }
    &.m-btn--purple {
        background-color: #801eff;
        color: white;
        border-color: #801eff;
        &:hover {
            background-color: #8f5eff;
            border-color: #8f5eff;
            color: white;
        }
        &:active {
            background-color: #5f2edd;
            border-color: #5f2edd;
            color: white;
        }
    }
    &.m-btn--pink {
        background-color: #ff69b4;
        color: white;
        border-color: #ff69b4;
        &:hover {
            background-color: #ff85c7;
            border-color: #ff85c7;
            color: white;
        }
        &:active {
            background-color: #ff4da8;
            border-color: #ff4da8;
            color: white;
        }
    }
    &.m-btn--gray {
        background-color: #6b6b6b;
        color: white;
        border-color: #6b6b6b;
        &:hover {
            background-color: #8a8a8a;
            border-color: #8a8a8a;
            color: white;
        }
        &:active {
            background-color: #4f4f4f;
            border-color: #4f4f4f;
            color: white;
        }
    }

    // 颜色变体 - 朴素样式
    &.m-btn--plain {
        &.m-btn--primary {
            color: #007bff;
            border-color: #007bff;
            background-color: #e7f3ff;
            &:hover {
                background-color: #cce7ff;
                border-color: #0d6efd;
            }
            &:active {
                background-color: #b3dbff;
                border-color: #0a58ca;
            }
        }
        &.m-btn--success {
            color: #5eb85e;
            border-color: #5eb85e;
            background-color: #f0faf0;
            &:hover {
                background-color: #e6f6e6;
                border-color: #70c670;
            }
            &:active {
                background-color: #d9f0d9;
                border-color: #4ca64c;
            }
        }
        &.m-btn--warning {
            color: #e6a23c;
            border-color: #e6a23c;
            background-color: #fdf6ec;
            &:hover {
                background-color: #faecd8;
                border-color: #ebb563;
            }
            &:active {
                background-color: #f8e3c5;
                border-color: #cf9236;
            }
        }
        &.m-btn--danger {
            color: #d64545;
            border-color: #d64545;
            background-color: #fdf0f0;
            &:hover {
                background-color: #fce4e4;
                border-color: #e25656;
            }
            &:active {
                background-color: #f9d7d7;
                border-color: #c43434;
            }
        }
        &.m-btn--info {
            color: #36b5b5;
            border-color: #36b5b5;
            background-color: #ecfcfc;
            &:hover {
                background-color: #e0fafa;
                border-color: #47c3c3;
            }
            &:active {
                background-color: #d4f7f7;
                border-color: #25a3a3;
            }
        }
        &.m-btn--purple {
            color: #801eff;
            border-color: #801eff;
            background-color: #f3f0ff;
            &:hover {
                background-color: #efe7ff;
                border-color: #8f5eff;
            }
            &:active {
                background-color: #e6defb;
                border-color: #5f2edd;
            }
        }
        &.m-btn--pink {
            color: #ff69b4;
            border-color: #ff69b4;
            background-color: #fff0f7;
            &:hover {
                background-color: #ffe0f4;
                border-color: #ff85c7;
            }
            &:active {
                background-color: #ffd0ea;
                border-color: #ff4da8;
            }
        }
        &.m-btn--gray {
            color: #333;
            border-color: #c0c0c0;
            background-color: #f0f0f0;
            &:hover {
                background-color: #e6e6e6;
                border-color: #a8a8a8;
            }
            &:active {
                background-color: #dcdcdc;
                border-color: #909090;
            }
        }
    }
    &.m-btn--outline {
        background-color: #fff;
        transition: none;
        &.m-btn--primary {
            color: #007bff;
            border-color: #007bff;
            &:hover {
                background-color: rgba(0, 123, 255, 0.05);
            }
            &:active {
                background-color: rgba(0, 123, 255, 0.1);
            }
        }
        &.m-btn--success {
            color: #5eb85e;
            border-color: #5eb85e;
            &:hover {
                background-color: rgba(94, 184, 94, 0.05);
            }
            &:active {
                background-color: rgba(94, 184, 94, 0.1);
            }
        }
        &.m-btn--warning {
            color: #e6a23c;
            border-color: #e6a23c;
            &:hover {
                background-color: rgba(230, 162, 60, 0.05);
            }
            &:active {
                background-color: rgba(230, 162, 60, 0.1);
            }
        }
        &.m-btn--danger {
            color: #d64545;
            border-color: #d64545;
            &:hover {
                background-color: rgba(214, 69, 69, 0.05);
            }
            &:active {
                background-color: rgba(214, 69, 69, 0.1);
            }
        }
        &.m-btn--info {
            color: #36b5b5;
            border-color: #36b5b5;
            &:hover {
                background-color: rgba(54, 181, 181, 0.05);
            }
            &:active {
                background-color: rgba(54, 181, 181, 0.1);
            }
        }
        &.m-btn--purple {
            color: #801eff;
            border-color: #801eff;
            &:hover {
                background-color: rgba(128, 30, 255, 0.05);
            }
            &:active {
                background-color: rgba(128, 30, 255, 0.1);
            }
        }
        &.m-btn--pink {
            color: #ff69b4;
            border-color: #ff69b4;
            &:hover {
                background-color: rgba(255, 105, 180, 0.05);
            }
            &:active {
                background-color: rgba(255, 105, 180, 0.1);
            }
        }
        &.m-btn--gray {
            color: #333;
            border-color: #c0c0c0;
            &:hover {
                background-color: rgba(51, 51, 51, 0.05);
            }
            &:active {
                background-color: rgba(51, 51, 51, 0.1);
            }
        }
    }

    // 禁用配色（统一收敛到灰阶，不使用透明度）
    &.m-btn--disabled {
        &.m-btn--plain,
        &.m-btn--outline {
            background-color: #f5f7fa;
            border-color: #e4e7ed;
            color: #c0c4cc;
        }

        &:not(.m-btn--plain):not(.m-btn--outline) {
            background-color: #c0c4cc;
            border-color: #c0c4cc;
            color: #ffffff;
        }
    }
}

@keyframes loading-rotate {
    from {
        transform: rotate(90deg);
    }
    to {
        transform: rotate(450deg);
    }
}

@keyframes loading-stretch {
    0% {
        stroke-dasharray: 20, 100;
        stroke-dashoffset: 0;
    }
    50% {
        stroke-dasharray: 80, 100;
        stroke-dashoffset: -5;
    }
    100% {
        stroke-dasharray: 20, 100;
        stroke-dashoffset: -120;
    }
}
</style>
