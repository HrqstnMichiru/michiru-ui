<template>
    <label
        class="m-checkbox"
        :class="[
            `m-checkbox--${size}`,
            `m-checkbox--${variant}`,
            `m-checkbox--${type}`,
            {
                'm-checkbox--disabled': disabled,
                'm-checkbox--checked': isChecked
            }
        ]">
        <input type="checkbox" class="m-checkbox__input" :checked="isChecked" :disabled="disabled" :value="value" @change="onChange" ref="inputRef" />
        <span class="m-checkbox__inner"></span>
        <span class="m-checkbox__label" v-if="label">{{ label }}</span>
    </label>
</template>

<script lang="ts" setup>
import { computed, inject, useTemplateRef } from "vue";
import type { MCheckBoxEmits, MCheckBoxGroupContext, MCheckBoxProps } from "./types";
import { MCheckBoxGroupContextKey } from "./types";

defineOptions({
    name: "MCheckBox"
});
const props = withDefaults(defineProps<MCheckBoxProps>(), {
    disabled: false,
    size: "medium",
    variant: "default",
    type: "box"
});
const emits = defineEmits<MCheckBoxEmits>();

const inputRef = useTemplateRef<HTMLInputElement>("inputRef");
const groupContext = inject<MCheckBoxGroupContext | null>(MCheckBoxGroupContextKey, null);
if (groupContext) {
    groupContext.register(props.value!);
}

const modelValue = defineModel<boolean>("modelValue", {
    default: false
});
const disabled = computed(() => {
    return groupContext?.disabled || props.disabled;
});
const size = computed(() => {
    return groupContext?.size || props.size;
});
const variant = computed(() => {
    return groupContext?.variant || props.variant;
});
const type = computed(() => {
    return groupContext?.type || props.type;
});
const isChecked = computed(() => {
    if (groupContext) {
        return groupContext.isChecked(props.value!);
    }
    return modelValue.value;
});

const onChange = () => {
    if (disabled.value) return;
    if (groupContext) {
        groupContext.toggle(props.value!);
        emits("change");
        return;
    }
    const checked = !!inputRef.value?.checked;
    modelValue.value = checked;
    emits("change");
};
</script>

<style lang="scss" scoped>
.m-checkbox {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    user-select: none;
    .m-checkbox__input {
        position: absolute;
        opacity: 0;
        pointer-events: none;
    }

    // box类型样式
    &.m-checkbox--box {
        .m-checkbox__inner {
            position: relative;
            display: inline-block;
            border-radius: 4px;
            border: 1px solid #c0c4cc;
            background: #ffffff;
            transition: all 0.2s ease;
            &::after {
                content: "";
                position: absolute;
                width: 4px;
                height: 8px;
                border: 2px solid #ffffff;
                border-top: 0;
                border-left: 0;
                transform: rotate(45deg) scale(0);
                transition: all 0.2s ease;
            }
        }
        .m-checkbox__label {
            margin-left: 8px;
            font-size: 16px;
            color: #61666d;
        }

        // 尺寸变体
        &.m-checkbox--small {
            .m-checkbox__input {
                width: 14px;
                height: 14px;
            }
            .m-checkbox__inner {
                width: 14px;
                height: 14px;
                &::after {
                    left: 3.5px;
                    top: 0px;
                }
            }
            .m-checkbox__label {
                font-size: 14px;
            }
        }
        &.m-checkbox--medium {
            .m-checkbox__input {
                width: 16px;
                height: 16px;
            }
            .m-checkbox__inner {
                width: 16px;
                height: 16px;
                &::after {
                    left: 4px;
                    top: 1px;
                }
            }
            .m-checkbox__label {
                font-size: 16px;
            }
        }
        &.m-checkbox--large {
            .m-checkbox__input {
                width: 18px;
                height: 18px;
            }
            .m-checkbox__inner {
                width: 18px;
                height: 18px;
                &::after {
                    left: 5px;
                    top: 2px;
                }
            }
            .m-checkbox__label {
                font-size: 18px;
            }
        }

        // 选中状态
        &.m-checkbox--checked .m-checkbox__inner::after {
            transform: rotate(45deg) scale(1);
        }

        // 禁用状态
        &.m-checkbox--disabled {
            cursor: not-allowed;
            .m-checkbox__label {
                color: #c0c4cc;
            }
            .m-checkbox__inner {
                background-color: #f5f7fa;
                border-color: #e4e7ed;
            }
            &.m-checkbox--checked .m-checkbox__inner {
                background-color: #f2f6fc;
                border-color: #dcdfe6;
                &::after {
                    border-color: #c0c4cc;
                }
            }
        }

        // 颜色变体
        &.m-checkbox--checked:not(m-.checkbox--disabled) {
            &.m-checkbox--default .m-checkbox__inner {
                background-color: #333;
                border-color: #333;
            }
            &.m-checkbox--primary .m-checkbox__inner {
                background-color: #007bff;
                border-color: #007bff;
            }
            &.m-checkbox--success .m-checkbox__inner {
                background-color: #28a745;
                border-color: #28a745;
            }
            &.m-checkbox--warning .m-checkbox__inner {
                background-color: #e6a23c;
                border-color: #e6a23c;
            }
            &.m-checkbox--danger .m-checkbox__inner {
                background-color: #dc3545;
                border-color: #dc3545;
            }
            &.m-checkbox--info .m-checkbox__inner {
                background-color: #36b5b5;
                border-color: #36b5b5;
            }
            &.m-checkbox--purple .m-checkbox__inner {
                background-color: #801eff;
                border-color: #801eff;
            }
            &.m-checkbox--pink .m-checkbox__inner {
                background-color: #ff69b4;
                border-color: #ff69b4;
            }
            &.m-checkbox--gray .m-checkbox__inner {
                background-color: #6b6b6b;
                border-color: #6b6b6b;
            }
        }
    }

    // 按钮类型样式
    &.m-checkbox--button {
        border: 1px solid #dcdfe6;
        background-color: #fff;
        color: #61666d;
        transition: all 0.3s var(--ease-in-out);
        &:not(:first-child) {
            margin-left: -1px;
        }
        &:first-child {
            &.m-checkbox--small {
                border-top-left-radius: 4px;
                border-bottom-left-radius: 4px;
            }
            &.m-checkbox--medium {
                border-top-left-radius: 6px;
                border-bottom-left-radius: 6px;
            }
            &.m-checkbox--large {
                border-top-left-radius: 8px;
                border-bottom-left-radius: 8px;
            }
        }
        &:last-child {
            &.m-checkbox--small {
                border-top-right-radius: 4px;
                border-bottom-right-radius: 4px;
            }
            &.m-checkbox--medium {
                border-top-right-radius: 6px;
                border-bottom-right-radius: 6px;
            }
            &.m-checkbox--large {
                border-top-right-radius: 8px;
                border-bottom-right-radius: 8px;
            }
        }

        // 尺寸变体
        &.m-checkbox--small {
            padding: 5.2px 9.2px;
            font-size: 14px;
            height: 28px;
            .m-checkbox__label {
                line-height: 16px;
            }
        }
        &.m-checkbox--medium {
            height: 34px;
            font-size: 16px;
            padding: 7.2px 13.2px;
            .m-checkbox__label {
                line-height: 18px;
            }
        }
        &.m-checkbox--large {
            height: 40px;
            padding: 9.2px 17.2px;
            font-size: 18px;
            .m-checkbox__label {
                line-height: 20px;
            }
        }

        // 选中状态
        &.m-checkbox--checked {
            color: #fff;
        }

        // 禁用状态
        &.m-checkbox--disabled {
            cursor: not-allowed;
            background-color: #f5f7fa;
            border-color: #e4e7ed;
            color: #c0c4cc;
        }

        // 颜色变体
        &:not(.m-checkbox--disabled).m-checkbox--checked {
            &.m-checkbox--default {
                background-color: #333;
            }
            &.m-checkbox--primary {
                background-color: #007bff;
            }
            &.m-checkbox--success {
                background-color: #28a745;
            }
            &.m-checkbox--warning {
                background-color: #e6a23c;
            }
            &.m-checkbox--danger {
                background-color: #dc3545;
            }
            &.m-checkbox--info {
                background-color: #36b5b5;
            }
            &.m-checkbox--purple {
                background-color: #801eff;
            }
            &.m-checkbox--pink {
                background-color: #ff69b4;
            }
            &.m-checkbox--gray {
                background-color: #6b6b6b;
            }
        }
    }
}
</style>
