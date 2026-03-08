<template>
    <div
        class="m-number-input-wrapper"
        :class="{
            'is-disabled': disabled,
            'is-focused': isFocus,
            [`m-number-input--${customSize}`]: customSize,
            'is-border': borderAlways
        }"
        :style="{
            width: customBlock ? '100%' : `${width}px`
        }"
        ref="wrapperRef"
        @click="handleWrapperClick">
        <div class="m-number-input__content">
            <div class="m-number-input__inner-wrapper">
                <span class="m-number-input__prefix-slot">
                    <slot name="prefix">
                        {{ prefixText }}
                    </slot>
                </span>
                <input
                    ref="inputRef"
                    class="m-number-input__inner"
                    type="text"
                    :value="displayValue"
                    :disabled="disabled"
                    :readonly="readonly"
                    autocomplete="off"
                    @input="handleInput"
                    @focus="handleFocus"
                    @blur="handleBlur"
                    @change="handleChange" />
                <span class="m-number-input__suffix-slot">
                    <slot name="suffix">
                        {{ suffixText }}
                    </slot>
                </span>
            </div>
            <div class="m-number-input__suffix" @mouseenter="isFocus = true" @mouseleave="isFocus = false">
                <MIcon name="ri:arrow-up-wide-fill" @click.stop="handleIncrease" />
                <MIcon name="ri:arrow-down-wide-fill" @click.stop="handleDecrease" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { MIcon } from "@/components";
import type { MFormContext, MFormItemContext } from "@/components/data/MForm/types";
import { MFormContextKey, MFormItemContextKey } from "@/components/data/MForm/types";
import { computed, inject, onMounted, onUnmounted, ref, useTemplateRef } from "vue";
import type { MNumberInputEmits, MNumberInputProps } from "./types";

defineOptions({
    name: "MNumberInput"
});

const props = withDefaults(defineProps<MNumberInputProps>(), {
    width: 125,
    injected: true,
    min: 0,
    precision: 0,
    step: 1,
    useGrouping: false
});

const emits = defineEmits<MNumberInputEmits>();
const formContext = inject<MFormContext | null>(MFormContextKey, null);
const formItemContext = inject<MFormItemContext | null>(MFormItemContextKey, null);
const customSize = computed(() => {
    return props.size || formItemContext?.size || "medium";
});
const customBlock = computed(() => {
    return props.block || formItemContext?.block;
});

const isFocus = ref(false); // 是否聚焦，用于聚焦时样式变化
const inputRef = useTemplateRef<HTMLInputElement>("inputRef");
const wrapperRef = useTemplateRef<HTMLDivElement>("wrapperRef");
const inputValue = defineModel<number>("modelValue");
const displayValue = computed(() => {
    if (inputValue.value === undefined) {
        return "";
    }
    const fixed = inputValue.value.toFixed(props.precision);
    if (!props.useGrouping) return fixed; // 不使用千分位分隔符，直接返回格式化后的字符串
    const [intPart = "0", decimalPart] = fixed.split(".");
    const withSep = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // 添加千分位分隔符
    const combined = decimalPart ? `${withSep}.${decimalPart}` : withSep;
    return combined;
});

const formatNumber = (val: string): number | undefined => {
    // 去除非数字
    if (!val || val.trim() === "") {
        return undefined;
    }
    const numValue = parseFloat(val.replace(/[^\d.-]/g, ""));

    // 应用最小值和最大值限制
    let finalValue = numValue;
    if (props.min !== undefined && finalValue < props.min) {
        finalValue = props.min;
    }
    if (props.max !== undefined && finalValue > props.max) {
        finalValue = props.max;
    }
    return finalValue;
};

// 注册到表单项
if (formItemContext && formItemContext.prop) {
    const initialValue = inputValue.value;
    formContext?.registerResetHandler(formItemContext.prop, () => {
        inputValue.value = initialValue; // 重置时恢复初始值
        formItemContext?.resetValidate();
    });
}

// 输入处理
const handleInput = (e: InputEvent) => {
    const target = e.target as HTMLInputElement;
    const val = target?.value;
    inputValue.value = formatNumber(val);
    emits("input", inputValue.value);
};

// 聚焦处理
const handleFocus = () => {
    isFocus.value = true;
    emits("focus");
};

// 失焦处理
const handleBlur = () => {
    isFocus.value = false;
    emits("blur");
    if (formItemContext && formItemContext.trigger === "blur") {
        formItemContext.validate();
    }
};

// 变化处理
const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const val = target?.value;
    const formattedValue = formatNumber(val);
    inputValue.value = formattedValue;
    emits("change");
    if (formItemContext && formItemContext.trigger === "change") {
        formItemContext.validate();
    }
};

const handleIncrease = () => {
    if (inputValue.value === undefined) return;
    const newValue = inputValue.value + props.step;
    const formattedValue = formatNumber(newValue.toString());
    inputValue.value = formattedValue;
    emits("change");
};

const handleDecrease = () => {
    if (inputValue.value === undefined) return;
    const newValue = inputValue.value - props.step;
    const formattedValue = formatNumber(newValue.toString());
    inputValue.value = formattedValue;
    emits("change");
};

const handleWrapperClick = () => {
    if (!isFocus.value) {
        inputRef.value?.focus();
    }
};

const handleClickOutside = (event: MouseEvent) => {
    if (!wrapperRef.value) return;
    if (wrapperRef.value.contains(event.target as HTMLElement)) return;
    if (isFocus.value) {
        inputRef.value?.blur();
    }
};

// 暴露方法
defineExpose({
    focus: () => inputRef.value?.focus(),
    blur: () => inputRef.value?.blur()
});

onMounted(() => {
    document.addEventListener("mousedown", handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener("mousedown", handleClickOutside);
});
</script>

<style lang="scss" scoped>
.m-number-input-wrapper {
    display: inline-flex;
    align-items: center;
    font-size: 16px;
    cursor: text;
    &.is-border .m-number-input__content {
        border-color: rgba(128, 30, 255, 1);
    }

    /* 聚焦状态 */
    &.is-focused:not(.is-border) .m-number-input__content {
        border-color: rgba(128, 30, 255, 1);
    }

    /* 禁用状态 */
    &.is-disabled {
        cursor: not-allowed;
        .m-number-input__content {
            cursor: not-allowed;
            background-color: #f5f5f5;
            border-color: #d0d0d0;
        }
        .m-number-input__inner {
            cursor: not-allowed !important;
            background-color: transparent !important;
            color: #999999 !important;
        }
    }

    // 输入框内容区域
    .m-number-input__content {
        display: flex;
        align-items: center;
        flex: 1;
        min-width: 0;
        position: relative;
        border: 1px solid rgb(221, 221, 221);
        background-color: #fff;
        transition: border-color 0.2s ease;
        .m-number-input__inner-wrapper {
            display: flex;
            flex: 1;
            gap: 2px;
            align-items: center;
            .m-number-input__prefix-slot,
            .m-number-input__suffix-slot {
                color: #999;
                display: flex;
                align-items: center;
            }
            .m-number-input__inner {
                font-family: inherit;
                flex: 1;
                width: 100%;
                border: none;
                outline: none;
                color: rgb(41, 52, 61);
                font-weight: 400;
                line-height: 1;
                padding: 0;
                margin: 0;
                &::placeholder {
                    color: #9facc5;
                    font-weight: 400;
                }
            }
        }
        .m-number-input__suffix {
            height: 100%;
            width: 24px;
            flex-shrink: 0;
            background-color: #f0efef;
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 2px;
            align-items: center;
            color: #999;
            border-left: 1px solid rgb(221, 221, 221);
            :deep(.m-icon) {
                cursor: pointer;
                user-select: none;
                transition: color 0.2s ease;
                &:hover {
                    color: rgba(128, 30, 255, 1);
                }
            }
        }
    }
    /* 尺寸变体 */
    &.m-number-input--small {
        font-size: 14px;
        .m-number-input__content {
            height: 28px;
            line-height: 28px;
            border-radius: 4px;
            .m-number-input__inner-wrapper {
                padding: 5.2px;
                .m-number-input__inner {
                    font-size: 14px;
                    line-height: 16px;
                    height: 16px;
                }
            }
            .m-number-input__suffix {
                border-radius: 0 3px 3px 0;
                :deep(.m-icon) {
                    font-size: 14px;
                }
            }
        }
    }
    &.m-number-input--medium {
        font-size: 16px;
        .m-number-input__content {
            height: 34px;
            line-height: 34px;
            border-radius: 6px;
            .m-number-input__inner-wrapper {
                padding: 7.2px;
                .m-number-input__inner {
                    font-size: 16px;
                    line-height: 18px;
                    height: 18px;
                }
            }
            .m-number-input__suffix {
                cursor: pointer;
                border-radius: 0 5px 5px 0;
                :deep(.m-icon) {
                    font-size: 16px;
                    &:hover {
                        color: rgba(128, 30, 255, 1);
                    }
                }
            }
        }
    }
    &.m-number-input--large {
        font-size: 18px;
        .m-number-input__content {
            height: 40px;
            line-height: 40px;
            border-radius: 8px;
            .m-number-input__inner-wrapper {
                padding: 9.2px;
                .m-number-input__inner {
                    font-size: 18px;
                    line-height: 20px;
                    height: 20px;
                }
            }
            .m-number-input__suffix {
                cursor: pointer;
                border-radius: 0 7px 7px 0;
                :deep(.m-icon) {
                    font-size: 18px;
                    &:hover {
                        color: rgba(128, 30, 255, 1);
                    }
                }
            }
        }
    }
}

/* 只读状态 */
.m-number-input-wrapper:has(.m-number-input-inner[readonly]) {
    background-color: #fafafa;
    .input-inner {
        cursor: default;
    }
}
</style>
