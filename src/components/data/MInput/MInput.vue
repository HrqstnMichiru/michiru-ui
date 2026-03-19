<template>
    <div
        class="m-input-wrapper"
        :class="{
            'is-disabled': disabled,
            'is-focused': isFocus,
            [`m-input--${customSize}`]: customSize,
            'is-border': borderAlways,
            'is-readonly': readonly
        }"
        :style="{
            width: customBlock ? '100%' : `${width}px`
        }"
        ref="wrapperRef"
        @click="handleWrapperClick">
        <!-- 输入框 -->
        <template v-if="type !== 'textarea'">
            <div class="m-text-wrapper">
                <div class="m-input__content" @mouseenter="isHover = true" @mouseleave="isHover = false">
                    <!-- 前缀图标 -->
                    <div class="m-input__prefix" v-if="prefixIcon || slots.prefix">
                        <MIcon :name="prefixIcon" v-if="prefixIcon" />
                        <!-- 插槽前缀 -->
                        <slot name="prefix">
                            <span v-if="prefixText" class="text">{{ prefixText }}</span>
                        </slot>
                    </div>
                    <!-- 输入框主体 -->
                    <input
                        ref="inputRef"
                        class="m-input__inner"
                        :type="showPassword && !passwordVisible ? 'password' : 'text'"
                        v-model="inputValue"
                        :placeholder="placeholder"
                        :disabled="disabled"
                        :readonly="readonly"
                        :maxlength="maxlength"
                        :minlength="minlength"
                        autocomplete="off"
                        @input="handleInput"
                        @focus="handleFocus"
                        @change="handleChange"
                        @blur="handleBlur" />
                    <!-- 后缀图标 -->
                    <div class="m-input__suffix" v-if="hasPotentialSuffixIcon">
                        <!-- 清除按钮 -->
                        <MIcon v-if="props.clearable && hasValue && !props.disabled && (isFocus || isHover)" name="material-symbols:cancel" @mousedown.prevent="handleClear" />
                        <!-- 自定义后缀图标 -->
                        <MIcon v-else-if="suffixIcon" :name="suffixIcon" />
                        <!-- 插槽后缀 -->
                        <slot name="suffix" v-else>
                            <span v-if="suffixText" class="text">{{ suffixText }}</span>
                        </slot>
                        <!-- 密码显示切换 -->
                        <MIcon v-if="showPassword && inputValue && !disabled" :name="passwordVisible ? 'mdi:eye' : 'mdi:eye-off'" @mousedown.prevent="togglePassword" />
                    </div>
                </div>
                <!-- 字数统计 -->
                <div v-if="showWordCount" class="word-count">
                    <span :class="{ 'word-count--exceed': currentLength > maxlength! }">{{ currentLength }}/{{ maxlength }}</span>
                </div>
            </div>
        </template>
        <!-- 多行文本框 -->
        <template v-else>
            <div class="m-textarea-wrapper">
                <textarea
                    ref="inputRef"
                    class="m-textarea__content"
                    v-model="inputValue"
                    :placeholder="placeholder"
                    :disabled="disabled"
                    :readonly="readonly"
                    :maxlength="maxlength"
                    :minlength="minlength"
                    :rows="rows"
                    autocomplete="off"
                    :style="{
                        resize: resizable ? 'vertical' : 'none'
                    }"
                    @input="handleInput"
                    @focus="handleFocus"
                    @change="handleChange"
                    @blur="handleBlur"></textarea>
                <!-- 字数统计 -->
                <div v-if="showWordCount" class="word-count">
                    <span :class="{ 'word-count--exceed': currentLength > maxlength! }">{{ currentLength }}/{{ maxlength }}</span>
                </div>
            </div>
        </template>
    </div>
</template>

<script lang="ts" setup>
import { MIcon } from "@/components";
import type { MFormContext, MFormItemContext } from "@/components/data/MForm/types";
import { MFormContextKey, MFormItemContextKey } from "@/components/data/MForm/types";
import { computed, inject, nextTick, onMounted, onUnmounted, ref, useSlots, useTemplateRef } from "vue";
import type { MInputEmits, MInputInstance, MInputProps } from "./types";

defineOptions({
    name: "MInput"
});
const props = withDefaults(defineProps<MInputProps>(), {
    width: 250,
    type: "text",
    injected: true,
    isEmpty: undefined
});
const slots = useSlots();
const emits = defineEmits<MInputEmits>();

const isFocus = ref(false); // 是否聚焦，用于聚焦时样式变化
const isHover = ref(false); // 是否悬停，用于悬停时显示清除按钮
const passwordVisible = ref(false); // 密码可见状态
const inputRef = useTemplateRef<HTMLInputElement>("inputRef");
const wrapperRef = useTemplateRef<HTMLDivElement>("wrapperRef");
const [inputValue, modifiers] = defineModel<string>("modelValue", {
    set(value) {
        let result = value;
        if (modifiers.trim) result = result.trim();
        if (modifiers.upper) result = result.toUpperCase();
        if (modifiers.lower) result = result.toLowerCase();
        return result;
    }
});
let formItemContext: MFormItemContext | null = null;
let formContext: MFormContext | null = null;
if (props.injected) {
    formItemContext = inject<MFormItemContext | null>(MFormItemContextKey, null);
    formContext = inject<MFormContext | null>(MFormContextKey, null);
}
const customSize = computed(() => {
    return props.size || formItemContext?.size || "medium";
});
const customBlock = computed(() => {
    return props.block || formItemContext?.block;
});

// 判断是否可能有后缀图标
const hasPotentialSuffixIcon = computed(() => {
    return props.suffixIcon || props.clearable || props.showPassword || slots.suffix;
});

// 计算当前字数和最大字数
const currentLength = computed(() => {
    return ((inputValue.value || "") as string).length;
});

// 判断是否显示字数统计
const showWordCount = computed(() => {
    return props.showWordLimit && props.maxlength;
});

const hasValue = computed(() => {
    // 如果外部传入了 isEmpty 属性，则使用它来判断
    if (props.isEmpty !== undefined) {
        return !props.isEmpty;
    }
    return !!inputValue.value;
});

// 注册到表单项
if (formItemContext && formItemContext.prop) {
    const initialValue = inputValue.value ?? "";
    formContext?.registerResetHandler(formItemContext.prop, () => {
        inputValue.value = initialValue;
        formItemContext?.resetValidate();
    });
}

// 输入处理
const handleInput = () => {
    if (props.readonly || props.disabled) return;
    emits("input", inputValue.value!);
};

// 聚焦处理
const handleFocus = () => {
    if (props.disabled) return;
    isFocus.value = true;
    emits("focus");
};

// 失焦处理
const handleBlur = () => {
    if (props.disabled) return;
    emits("blur");
    if (formItemContext && formItemContext.trigger === "blur") {
        formItemContext.validate();
    }
};

// 清除内容
const handleClear = () => {
    if (props.disabled) return;
    if (!props.readonly) {
        inputValue.value = "";
    }
    emits("clear");
    nextTick(() => {
        inputRef.value?.focus();
    });
};

const handleChange = () => {
    emits("change");
    if (formItemContext && formItemContext.trigger === "change") {
        formItemContext.validate();
    }
};

// 切换密码显示
const togglePassword = () => {
    passwordVisible.value = !passwordVisible.value;
    // 保持输入框焦点
    nextTick(() => {
        inputRef.value?.focus();
    });
};

const handleWrapperClick = () => {
    if (props.disabled) return;
    inputRef.value?.focus();
};

const handleClickOutside = (event: MouseEvent) => {
    if (!wrapperRef.value) return;
    if (wrapperRef.value.contains(event.target as HTMLElement)) return;
    if (isFocus.value) {
        isFocus.value = false;
        inputRef.value?.blur();
    }
};

// 暴露方法
defineExpose<MInputInstance>({
    focus: () => {
        isFocus.value = true;
        inputRef.value?.focus();
    },
    blur: () => {
        isFocus.value = false;
        inputRef.value?.blur();
    },
    ref: wrapperRef
});

onMounted(() => {
    document.addEventListener("mousedown", handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener("mousedown", handleClickOutside);
});
</script>

<style lang="scss" scoped>
.m-input-wrapper {
    display: inline-flex;
    align-items: center;
    font-size: 16px;
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: text;
    &.is-readonly {
        cursor: default !important;
        .m-input__inner {
            cursor: default !important;
        }
        .m-textarea__content {
            cursor: default !important;
        }
    }

    &.is-border {
        .m-textarea-wrapper .m-textarea__content {
            border-color: rgba(128, 30, 255, 1);
        }
        .m-text-wrapper .m-input__content {
            border-color: rgba(128, 30, 255, 1);
        }
    }

    /* 聚焦状态 */
    &.is-focused:not(.is-border) .m-text-wrapper .m-input__content {
        border-color: rgba(128, 30, 255, 1);
    }
    &.is-focused:not(.is-border) .m-textarea-wrapper .m-textarea__content {
        border-color: rgba(128, 30, 255, 1);
    }

    /* 禁用状态 */
    &.is-disabled {
        cursor: not-allowed;
        .m-input__content {
            cursor: not-allowed;
            background-color: #f5f5f5;
            border-color: #d0d0d0;
            .m-input__prefix,
            .m-input__suffix {
                color: #bbb !important;
                cursor: not-allowed !important;
            }
            .m-input__inner {
                cursor: not-allowed !important;
                background-color: transparent !important;
                color: #bbb !important;
                &::placeholder {
                    color: #ddd !important;
                }
            }
        }
        .m-textarea__content {
            cursor: not-allowed !important;
            background-color: #f5f5f5 !important;
            border-color: #d0d0d0 !important;
            color: #bbb !important;
            &::placeholder {
                color: #ddd !important;
            }
        }
    }

    // 输入框内容区域
    .m-text-wrapper {
        flex: 1;
        position: relative;
        width: 100%;
        .m-input__content {
            display: flex;
            align-items: center;
            width: 100%;
            gap: 5px;
            min-width: 0;
            border: 1px solid rgb(221, 221, 221);
            background-color: #fff;
            transition: border-color 0.2s ease;
            .m-input__prefix,
            .m-input__suffix {
                display: flex;
                align-items: center;
                flex-shrink: 0;
                color: #999;
                gap: 2px;
                cursor: pointer;
            }
            .m-input__inner {
                font-family: inherit;
                flex: 1;
                width: 100%;
                border: none;
                outline: none;
                color: #3d4449;
                font-weight: 400;
                line-height: 1.5;
                padding: 0;
                margin: 0;
                &::placeholder {
                    color: #9facc5;
                    font-weight: 400;
                }
            }
        }
        .word-count {
            position: absolute;
            right: 5px;
            line-height: 1;
            font-size: 12px;
            color: #9ca3af;
            pointer-events: none;
            &.word-count--exceed {
                color: #ef4444;
            }
        }
    }

    .m-textarea-wrapper {
        flex: 1;
        position: relative;
        width: 100%;

        .m-textarea__content {
            display: block;
            width: 100%;
            min-height: 80px;
            border: 1px solid #e5e7eb;
            outline: none;
            color: #333;
            font-weight: 400;
            line-height: 1.5;
            background-color: #ffffff;
            font-size: inherit;
            transition: border-color 0.2s ease;
            &::placeholder {
                color: #9ca3af;
                font-weight: 400;
            }
        }
        .word-count {
            position: absolute;
            bottom: 8px;
            right: 5px;
            font-size: 12px;
            color: #9ca3af;
            pointer-events: none;
            background-color: rgba(255, 255, 255, 0.8);
            padding: 2px 4px;
            border-radius: 3px;
            &.word-count--exceed {
                color: #ef4444;
            }
        }
    }

    /* 尺寸变体 */
    &.m-input--small {
        font-size: 14px;
        .m-text-wrapper {
            .m-input__content {
                height: 28px;
                font-size: 14px;
                line-height: 28px;
                padding: 0 6px;
                border-radius: 4px;
                .m-input__inner {
                    font-size: 14px;
                    line-height: 16px;
                }
            }
            .word-count {
                top: 28px;
            }
        }
        .m-textarea__content {
            border-radius: 4px;
            padding: 6px;
        }
        .m-input__prefix,
        .m-input__suffix {
            .text {
                font-size: 14px;
            }
            :deep(.m-icon) {
                font-size: 16px;
            }
        }
    }

    &.m-input--medium {
        font-size: 15px;
        .m-text-wrapper {
            .m-input__content {
                height: 34px;
                font-size: 15px;
                line-height: 34px;
                padding: 0 8px;
                border-radius: 6px;
                .m-input__inner {
                    font-size: 15px;
                    line-height: 18px;
                }
            }
            .word-count {
                top: 34px;
            }
        }
        .m-textarea__content {
            border-radius: 6px;
            padding: 8px;
        }
        .m-input__prefix,
        .m-input__suffix {
            .text {
                font-size: 15px;
            }
            :deep(.m-icon) {
                font-size: 18px;
            }
        }
    }
    &.m-input--large {
        font-size: 16px;
        .m-text-wrapper {
            .m-input__content {
                height: 40px;
                font-size: 16px;
                padding: 0 10px;
                border-radius: 8px;
                line-height: 40px;
                .m-input__inner {
                    line-height: 20px;
                    font-size: 16px;
                }
            }
            .word-count {
                top: 40px;
            }
        }
        .m-textarea__content {
            border-radius: 8px;
            padding: 10px;
        }
        .m-input__prefix,
        .m-input__suffix {
            .text {
                font-size: 16px;
            }
            :deep(.m-icon) {
                font-size: 20px;
            }
        }
    }
}

/* 只读状态 */
.m-input-wrapper:has(.m-input-inner[readonly]) {
    background-color: #fafafa;
    .input-inner {
        cursor: default;
    }
}

input[type="password"]::-ms-reveal,
input[type="password"]::-ms-clear,
input[type="password"]::-webkit-credentials-auto-fill-button,
input[type="password"]::-webkit-clear-button,
input[type="password"]::-webkit-textfield-decoration-container,
input[type="password"]::-webkit-password-toggle-button {
    display: none !important;
    appearance: none;
}

/* Firefox */
input[type="password"]::-moz-password-toggle {
    display: none !important;
}
</style>
