<template>
    <label
        class="m-radiobox"
        :class="[
            `m-radiobox--${size}`,
            `m-radiobox--${variant}`,
            `m-radiobox--${radioType}`,
            {
                'm-radiobox--disabled': disabled,
                'm-radiobox--checked': isChecked,
                'm-radiobox--bordered': bordered
            }
        ]">
        <input type="radio" class="m-radiobox__input" :checked="isChecked" :disabled="disabled" :value="value" @change="handleChange" />
        <span class="m-radiobox__inner" v-if="radioType === 'box'"></span>
        <span class="m-radiobox__label">{{ label }}</span>
    </label>
</template>

<script lang="ts" setup>
import { computed, inject } from "vue";
import type { MRadioBoxGroupContext, MRadioBoxProps } from "./types";
import { MRadioBoxGroupContextKey } from "./types";

defineOptions({
    name: "MRadioBox"
});

const props = defineProps<MRadioBoxProps>();
const groupContext = inject<MRadioBoxGroupContext>(MRadioBoxGroupContextKey);
const radioType = computed(() => {
    return groupContext?.type || "box";
});
const disabled = computed(() => {
    return props.disabled || groupContext?.disabled || false;
});
const size = computed(() => {
    return props.size || groupContext?.size || "medium";
});
const bordered = computed(() => {
    if (radioType.value !== "box") return false;
    return props.bordered || groupContext?.bordered || false;
});
const variant = computed(() => {
    return props.variant || groupContext?.variant || "primary";
});
const isChecked = computed(() => {
    return groupContext?.isChecked(props.value) || false;
});
const handleChange = () => {
    if (disabled.value) return;
    if (groupContext) {
        groupContext.toggleChecked(props.value);
    }
};
</script>

<style lang="scss" scoped>
.m-radiobox {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    user-select: none;
    .m-radiobox__input {
        position: absolute;
        opacity: 0;
        pointer-events: none;
    }

    // box类型样式
    &.m-radiobox--box {
        .m-radiobox__inner {
            position: relative;
            display: inline-block;
            border-radius: 50%;
            border: 1px solid #dcdfe6;
            background: #ffffff;
            // 使用内部圆点表示选中状态
            &::after {
                content: "";
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0);
                border-radius: 50%;
                background: #ffffff;
                transition: all 0.2s ease;
            }
        }
        .m-radiobox__label {
            margin-left: 4px;
            color: #61666d;
        }

        &.m-radiobox--bordered {
            border: 1px solid #dcdfe6;
            background: #fff;
            transition: all 0.2s var(--ease-in-out);

            &.m-radiobox--small {
                height: 28px;
                padding: 5.2px 8px;
                border-radius: 4px;
            }
            &.m-radiobox--medium {
                height: 34px;
                padding: 7.2px 10px;
                border-radius: 6px;
            }
            &.m-radiobox--large {
                height: 40px;
                padding: 9.2px 12px;
                border-radius: 8px;
            }

            &:not(.m-radiobox--disabled) {
                border-color: var(--m-radiobox-bordered-weak, #dcdfe6);
                &:hover {
                    border-color: var(--m-radiobox-bordered-color, #007bff);
                }
            }

            &.m-radiobox--checked:not(.m-radiobox--disabled) {
                border-color: var(--m-radiobox-bordered-color, #007bff);
                background-color: var(--m-radiobox-bordered-bg, rgba(0, 123, 255, 0.1));
                .m-radiobox__label {
                    color: var(--m-radiobox-bordered-color, #007bff);
                }
            }

            &.m-radiobox--disabled {
                border-color: #e4e7ed;
                background-color: #f5f7fa;
            }
        }

        // 尺寸变体
        &.m-radiobox--small {
            .m-radiobox__inner {
                width: 14px;
                height: 14px;
                &::after {
                    width: 6px;
                    height: 6px;
                }
            }
            .m-radiobox__label {
                font-size: 14px;
                line-height: 16px;
            }
        }
        &.m-radiobox--medium {
            .m-radiobox__inner {
                width: 16px;
                height: 16px;
                &::after {
                    width: 8px;
                    height: 8px;
                }
            }
            .m-radiobox__label {
                font-size: 16px;
                line-height: 18px;
            }
        }
        &.m-radiobox--large {
            .m-radiobox__inner {
                width: 18px;
                height: 18px;
                &::after {
                    width: 10px;
                    height: 10px;
                }
            }
            .m-radiobox__label {
                font-size: 18px;
                line-height: 20px;
            }
        }

        // 选中状态
        &.m-radiobox--checked .m-radiobox__inner::after {
            transform: translate(-50%, -50%) scale(1);
        }

        // 禁用状态
        &.m-radiobox--disabled {
            cursor: not-allowed;
            .m-radiobox__inner {
                background-color: #f5f7fa;
                border-color: #e4e7ed;
            }
            .m-radiobox__label {
                color: #c0c4cc;
            }
            &.m-radiobox--checked .m-radiobox__inner {
                background-color: #f2f6fc;
                border-color: #dcdfe6;
                &::after {
                    background-color: #c0c4cc;
                }
            }
        }

        // 颜色变体
        &.m-radiobox--checked:not(.m-radiobox--disabled) {
            &.m-radiobox--primary .m-radiobox__inner {
                background-color: #007bff;
                border-color: #007bff;
            }
            &.m-radiobox--success .m-radiobox__inner {
                background-color: #28a745;
                border-color: #28a745;
            }
            &.m-radiobox--warning .m-radiobox__inner {
                background-color: #e6a23c;
                border-color: #e6a23c;
            }
            &.m-radiobox--danger .m-radiobox__inner {
                background-color: #dc3545;
                border-color: #dc3545;
            }
            &.m-radiobox--info .m-radiobox__inner {
                background-color: #36b5b5;
                border-color: #36b5b5;
            }
            &.m-radiobox--purple .m-radiobox__inner {
                background-color: #801eff;
                border-color: #801eff;
            }
            &.m-radiobox--pink .m-radiobox__inner {
                background-color: #ff69b4;
                border-color: #ff69b4;
            }
            &.m-radiobox--gray .m-radiobox__inner {
                background-color: #6b6b6b;
                border-color: #6b6b6b;
            }
        }

        &.m-radiobox--bordered:not(.m-radiobox--disabled) {
            &.m-radiobox--primary {
                --m-radiobox-bordered-color: #007bff;
                --m-radiobox-bordered-weak: rgba(0, 123, 255, 0.45);
                --m-radiobox-bordered-bg: rgba(0, 123, 255, 0.1);
            }
            &.m-radiobox--success {
                --m-radiobox-bordered-color: #28a745;
                --m-radiobox-bordered-weak: rgba(40, 167, 69, 0.45);
                --m-radiobox-bordered-bg: rgba(40, 167, 69, 0.1);
            }
            &.m-radiobox--warning {
                --m-radiobox-bordered-color: #e6a23c;
                --m-radiobox-bordered-weak: rgba(230, 162, 60, 0.45);
                --m-radiobox-bordered-bg: rgba(230, 162, 60, 0.12);
            }
            &.m-radiobox--danger {
                --m-radiobox-bordered-color: #dc3545;
                --m-radiobox-bordered-weak: rgba(220, 53, 69, 0.45);
                --m-radiobox-bordered-bg: rgba(220, 53, 69, 0.1);
            }
            &.m-radiobox--info {
                --m-radiobox-bordered-color: #36b5b5;
                --m-radiobox-bordered-weak: rgba(54, 181, 181, 0.45);
                --m-radiobox-bordered-bg: rgba(54, 181, 181, 0.1);
            }
            &.m-radiobox--purple {
                --m-radiobox-bordered-color: #801eff;
                --m-radiobox-bordered-weak: rgba(128, 30, 255, 0.45);
                --m-radiobox-bordered-bg: rgba(128, 30, 255, 0.1);
            }
            &.m-radiobox--pink {
                --m-radiobox-bordered-color: #ff69b4;
                --m-radiobox-bordered-weak: rgba(255, 105, 180, 0.45);
                --m-radiobox-bordered-bg: rgba(255, 105, 180, 0.1);
            }
            &.m-radiobox--gray {
                --m-radiobox-bordered-color: #6b6b6b;
                --m-radiobox-bordered-weak: rgba(107, 107, 107, 0.45);
                --m-radiobox-bordered-bg: rgba(107, 107, 107, 0.1);
            }
        }
    }

    // 按钮类型样式
    &.m-radiobox--button {
        border: 1px solid #dcdfe6;
        background-color: #fff;
        color: #61666d;
        transition: all 0.3s var(--ease-in-out);
        &:not(:first-child) {
            margin-left: -1px;
        }
        &:first-child {
            &.m-radiobox--small {
                border-top-left-radius: 4px;
                border-bottom-left-radius: 4px;
            }
            &.m-radiobox--medium {
                border-top-left-radius: 6px;
                border-bottom-left-radius: 6px;
            }
            &.m-radiobox--large {
                border-top-left-radius: 8px;
                border-bottom-left-radius: 8px;
            }
        }
        &:last-child {
            &.m-radiobox--small {
                border-top-right-radius: 4px;
                border-bottom-right-radius: 4px;
            }
            &.m-radiobox--medium {
                border-top-right-radius: 6px;
                border-bottom-right-radius: 6px;
            }
            &.m-radiobox--large {
                border-top-right-radius: 8px;
                border-bottom-right-radius: 8px;
            }
        }

        // 尺寸变体
        &.m-radiobox--small {
            height: 28px;
            padding: 5.2px 9.2px;
            font-size: 14px;
            .m-radiobox__label {
                line-height: 16px;
            }
        }
        &.m-radiobox--medium {
            height: 34px;
            font-size: 16px;
            padding: 7.2px 13.2px;
            .m-radiobox__label {
                line-height: 18px;
            }
        }
        &.m-radiobox--large {
            height: 40px;
            padding: 9.2px 17.2px;
            font-size: 18px;
            .m-radiobox__label {
                line-height: 20px;
            }
        }

        // 选中状态
        &.m-radiobox--checked {
            color: #fff;
        }

        // 禁用状态
        &.m-radiobox--disabled {
            background-color: #f5f7fa;
            border-color: #e4e7ed;
            color: #c0c4cc;
            cursor: not-allowed;
        }

        // 颜色变体 - 选中状态
        &.m-radiobox--checked:not(.m-radiobox--disabled) {
            &.m-radiobox--primary {
                background-color: #007bff;
            }
            &.m-radiobox--success {
                background-color: #28a745;
            }
            &.m-radiobox--warning {
                background-color: #e6a23c;
            }
            &.m-radiobox--danger {
                background-color: #dc3545;
            }
            &.m-radiobox--info {
                background-color: #36b5b5;
            }
            &.m-radiobox--purple {
                background-color: #801eff;
            }
            &.m-radiobox--pink {
                background-color: #ff69b4;
            }
            &.m-radiobox--gray {
                background-color: #6b6b6b;
            }
        }
    }
}
</style>
