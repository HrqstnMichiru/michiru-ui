<template>
    <label
        class="m-checkbox"
        :class="[
            `m-checkbox--${size}`,
            `m-checkbox--${variant}`,
            `m-checkbox--${type}`,
            {
                'm-checkbox--disabled': disabled,
                'm-checkbox--checked': isChecked,
                'm-checkbox--indeterminate': isIndeterminate,
                'm-checkbox--bordered': bordered
            }
        ]">
        <input type="checkbox" class="m-checkbox__input" :checked="isChecked" :disabled="disabled" :value="value" @change="onChange" ref="inputRef" />
        <span class="m-checkbox__inner"></span>
        <span class="m-checkbox__label" v-if="label">{{ label }}</span>
    </label>
</template>

<script lang="ts" setup>
import { computed, inject, useTemplateRef, watch } from "vue";
import type { MCheckBoxEmits, MCheckBoxGroupContext, MCheckBoxProps, MCheckBoxState } from "./types";
import { MCheckBoxGroupContextKey } from "./types";

defineOptions({
    name: "MCheckBox"
});
const props = defineProps<MCheckBoxProps>();
const emits = defineEmits<MCheckBoxEmits>();

const inputRef = useTemplateRef<HTMLInputElement>("inputRef");
const groupContext = inject<MCheckBoxGroupContext | null>(MCheckBoxGroupContextKey, null);
if (groupContext) {
    groupContext.register(props.value!);
}

const modelValue = defineModel<MCheckBoxState>("modelValue", {
    default: false
});
const disabled = computed(() => {
    return props.disabled || groupContext?.disabled;
});
const size = computed(() => {
    return props.size || groupContext?.size || "medium";
});
const variant = computed(() => {
    return props.variant || groupContext?.variant || "primary";
});
const type = computed(() => {
    return props.type || groupContext?.type || "box";
});
const bordered = computed(() => {
    if (type.value !== "box") return false;
    return props.bordered || groupContext?.bordered || false;
});
// 部分选择状态
const isIndeterminate = computed(() => {
    if (groupContext) return false;
    return modelValue.value === "indeterminate";
});
// 选中状态
const isChecked = computed(() => {
    if (groupContext) {
        return groupContext.isChecked(props.value!);
    }
    return modelValue.value === true;
});

// 同步部分选择状态
watch(isIndeterminate, value => {
    if (inputRef.value) {
        inputRef.value.indeterminate = value;
    }
});

const onChange = () => {
    // 禁用状态不响应点击事件
    if (disabled.value) return;
    // 如果在组中，调用组的toggle方法切换选中状态
    if (groupContext) {
        groupContext.toggle(props.value!);
        emits("change");
        return;
    }

    // 如果当前状态是部分选择，点击后变为选中状态
    if (isIndeterminate.value) {
        modelValue.value = true;
        emits("change");
        return;
    }

    // 否则就是普通的选中/取消选中状态，直接取反即可
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
            margin-left: 4px;
            font-size: 16px;
            color: #61666d;
        }

        &.m-checkbox--bordered {
            border: 1px solid #dcdfe6;
            background: #fff;
            transition: all 0.2s var(--ease-in-out);

            &.m-checkbox--small {
                height: 28px;
                padding: 5.2px 7.2px;
                border-radius: 4px;
            }
            &.m-checkbox--medium {
                height: 34px;
                padding: 7.2px 9.2px;
                border-radius: 6px;
            }
            &.m-checkbox--large {
                height: 40px;
                padding: 9.2px 11.2px;
                border-radius: 8px;
            }

            &:not(.m-checkbox--disabled) {
                border-color: var(--m-checkbox-bordered-weak, #dcdfe6);
                &:hover {
                    border-color: var(--m-checkbox-bordered-color, #007bff);
                }
            }

            &.m-checkbox--checked:not(.m-checkbox--disabled),
            &.m-checkbox--indeterminate:not(.m-checkbox--disabled) {
                border-color: var(--m-checkbox-bordered-color, #007bff);
                background-color: var(--m-checkbox-bordered-bg, rgba(0, 123, 255, 0.1));
                .m-checkbox__label {
                    color: var(--m-checkbox-bordered-color, #007bff);
                }
            }

            &.m-checkbox--disabled {
                border-color: #e4e7ed;
                background-color: #f5f7fa;
            }
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
                font-size: 15px;
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
                font-size: 16px;
            }
        }

        // 选中状态
        &.m-checkbox--checked .m-checkbox__inner::after {
            transform: rotate(45deg) scale(1);
        }

        // 部分选择状态
        &.m-checkbox--indeterminate .m-checkbox__inner::after {
            border: 0;
            height: 2px;
            border-radius: 1px;
            transform: translate(-50%, -50%) scale(1);
            top: 50%;
            left: 50%;
            background: #ffffff;
        }

        &.m-checkbox--small.m-checkbox--indeterminate .m-checkbox__inner::after {
            width: 6px;
        }
        &.m-checkbox--medium.m-checkbox--indeterminate .m-checkbox__inner::after {
            width: 8px;
        }
        &.m-checkbox--large.m-checkbox--indeterminate .m-checkbox__inner::after {
            width: 10px;
        }

        // 禁用状态
        &.m-checkbox--disabled {
            cursor: not-allowed;
            .m-checkbox__inner {
                background-color: #f5f7fa;
                border-color: #e4e7ed;
            }
            .m-checkbox__label {
                color: #c0c4cc;
            }
            &.m-checkbox--checked .m-checkbox__inner {
                background-color: #f2f6fc;
                border-color: #dcdfe6;
                &::after {
                    border-color: #c0c4cc;
                    background-color: transparent;
                }
            }
            &.m-checkbox--indeterminate .m-checkbox__inner {
                background-color: #f2f6fc;
                border-color: #dcdfe6;
                &::after {
                    border: 0;
                    background-color: #c0c4cc;
                }
            }
        }

        // 颜色变体
        &.m-checkbox--checked:not(.m-checkbox--disabled),
        &.m-checkbox--indeterminate:not(.m-checkbox--disabled) {
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

        &.m-checkbox--bordered:not(.m-checkbox--disabled) {
            &.m-checkbox--primary {
                --m-checkbox-bordered-color: #007bff;
                --m-checkbox-bordered-weak: rgba(0, 123, 255, 0.45);
                --m-checkbox-bordered-bg: rgba(0, 123, 255, 0.1);
            }
            &.m-checkbox--success {
                --m-checkbox-bordered-color: #28a745;
                --m-checkbox-bordered-weak: rgba(40, 167, 69, 0.45);
                --m-checkbox-bordered-bg: rgba(40, 167, 69, 0.1);
            }
            &.m-checkbox--warning {
                --m-checkbox-bordered-color: #e6a23c;
                --m-checkbox-bordered-weak: rgba(230, 162, 60, 0.45);
                --m-checkbox-bordered-bg: rgba(230, 162, 60, 0.12);
            }
            &.m-checkbox--danger {
                --m-checkbox-bordered-color: #dc3545;
                --m-checkbox-bordered-weak: rgba(220, 53, 69, 0.45);
                --m-checkbox-bordered-bg: rgba(220, 53, 69, 0.1);
            }
            &.m-checkbox--info {
                --m-checkbox-bordered-color: #36b5b5;
                --m-checkbox-bordered-weak: rgba(54, 181, 181, 0.45);
                --m-checkbox-bordered-bg: rgba(54, 181, 181, 0.1);
            }
            &.m-checkbox--purple {
                --m-checkbox-bordered-color: #801eff;
                --m-checkbox-bordered-weak: rgba(128, 30, 255, 0.45);
                --m-checkbox-bordered-bg: rgba(128, 30, 255, 0.1);
            }
            &.m-checkbox--pink {
                --m-checkbox-bordered-color: #ff69b4;
                --m-checkbox-bordered-weak: rgba(255, 105, 180, 0.45);
                --m-checkbox-bordered-bg: rgba(255, 105, 180, 0.1);
            }
            &.m-checkbox--gray {
                --m-checkbox-bordered-color: #6b6b6b;
                --m-checkbox-bordered-weak: rgba(107, 107, 107, 0.45);
                --m-checkbox-bordered-bg: rgba(107, 107, 107, 0.1);
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
            padding: 5.2px 7.2px;
            font-size: 14px;
            height: 28px;
            .m-checkbox__label {
                line-height: 16px;
            }
        }
        &.m-checkbox--medium {
            height: 34px;
            font-size: 15px;
            padding: 7.2px 9.2px;
            .m-checkbox__label {
                line-height: 18px;
            }
        }
        &.m-checkbox--large {
            height: 40px;
            padding: 9.2px 11.2px;
            font-size: 16px;
            .m-checkbox__label {
                line-height: 20px;
            }
        }

        // 选中状态
        &.m-checkbox--checked,
        &.m-checkbox--indeterminate {
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
        &:not(.m-checkbox--disabled).m-checkbox--checked,
        &:not(.m-checkbox--disabled).m-checkbox--indeterminate {
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
