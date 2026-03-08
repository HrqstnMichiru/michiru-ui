<template>
    <div
        class="m-form-item"
        :class="[`m-form-item--${customPosition}`]"
        :style="{
            width: props.block ? '100%' : 'auto',
            '--aligns': customAlign,
            '--space': props.space ? 'space-between' : 'flex-start'
        }">
        <span
            class="m-form-item__info"
            :style="{
                marginRight: `${gap}px`
            }"
            v-if="label || customRequired">
            <span v-if="customRequired" class="required-mark">*</span>
            <label
                class="m-form-item__label"
                :class="[`m-form-item__label--${customSize}`]"
                :style="{
                    textAlign: customAlign,
                    width: `${customWidth}px`
                }"
                v-if="label">
                {{ label }}
            </label>
        </span>
        <div
            class="m-form-item__content"
            ref="contentRef"
            :style="{
                width: props.block ? '100%' : 'auto'
            }">
            <slot></slot>
            <Transition name="error-shake">
                <p v-show="errorMessage" class="m-form-item__error" ref="errorRef">
                    {{ errorMessage }}
                </p>
            </Transition>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, inject, onBeforeUnmount, onMounted, provide, ref, useTemplateRef } from "vue";
import type { MFormContext, MFormItemContext, MFormItemProps } from "./types";
import { MFormContextKey, MFormItemContextKey } from "./types";

defineOptions({
    name: "MFormItem"
});
const props = withDefaults(defineProps<MFormItemProps>(), {
    trigger: "blur",
    gap: 10,
    aligns: "center",
    block: false,
    space: false
});
const formContext = inject<MFormContext>(MFormContextKey);
const errorMessage = ref<string>("");
const contentRef = useTemplateRef<HTMLDivElement>("contentRef");
const errorRef = useTemplateRef<HTMLParagraphElement>("errorRef");
const customPosition = computed(() => {
    return props.labelPosition || formContext?.labelPosition;
});
const customAlign = computed(() => {
    return props.labelAlign || formContext?.labelAlign;
});
const customWidth = computed(() => {
    return props.labelWidth || formContext?.labelWidth;
});
const customSize = computed(() => {
    return props.size || formContext?.size;
});
const customRequired = computed(() => {
    return props.required || (formContext?.rules && props.prop ? formContext.rules[props.prop]?.some(rule => "required" in rule && rule.required) : false);
});

const _validate = async (): Promise<void> => {
    if (!props.prop) return; // 没有prop属性，不参与验证
    if (!formContext || !formContext.rules) return; // 没有表单上下文或规则，不参与验证
    const rules = formContext.rules[props.prop];
    const value = formContext.model[props.prop];
    if (props.required) {
        if (Array.isArray(value)) {
            if (value.length === 0) {
                throw new Error("该项不能为空");
            }
        } else {
            if (value === "" || value === null || value === undefined) {
                throw new Error("该项不能为空");
            }
        }
    }
    for (const rule of rules) {
        if ("required" in rule && rule.required) {
            if (Array.isArray(value)) {
                if (value.length === 0) {
                    throw new Error(rule.message);
                }
            } else {
                if (value === "" || value === null || value === undefined) {
                    throw new Error(rule.message);
                }
            }
        } else if (("minLength" in rule || "maxLength" in rule) && (rule.minLength !== undefined || rule.maxLength !== undefined)) {
            const testValue = (value as string).trim();
            if (rule.minLength !== undefined && testValue.length < rule.minLength) {
                throw new Error(rule.message);
            }
            if (rule.maxLength !== undefined && testValue.length > rule.maxLength) {
                throw new Error(rule.message);
            }
        } else if (("min" in rule || "max" in rule) && (rule.min !== undefined || rule.max !== undefined)) {
            const testValue = value as number;
            if (rule.min !== undefined && testValue < rule.min) {
                throw new Error(rule.message);
            }
            if (rule.max !== undefined && testValue > rule.max) {
                throw new Error(rule.message);
            }
        } else if ("pattern" in rule) {
            const testValue = (value as string).trim();
            if (!rule.pattern.test(testValue)) {
                throw new Error(rule.message);
            }
        } else if ("validator" in rule) {
            const result = await rule.validator();
            if (!result) {
                throw new Error(rule.message);
            }
        }
    }
};
const validate = async (): Promise<boolean> => {
    try {
        await _validate();
        errorMessage.value = "";
        return true;
    } catch (error: any) {
        errorMessage.value = error.message;
        return false;
    }
};
if (props.prop && formContext) {
    formContext.registerValidator(props.prop, validate);
}

provide<MFormItemContext>(MFormItemContextKey, {
    validate,
    trigger: props.trigger,
    prop: props.prop,
    size: customSize.value!,
    block: props.block,
    resetValidate: () => {
        errorMessage.value = "";
    }
});

let observer: ResizeObserver | null = null;
onMounted(() => {
    if (contentRef.value) {
        observer = new ResizeObserver(() => {
            if (errorRef.value && contentRef.value) {
                const rect = contentRef.value.getBoundingClientRect();
                errorRef.value.style.top = `${rect.height}px`;
            }
        });
        observer.observe(contentRef.value);
    }
});
onBeforeUnmount(() => {
    if (observer) {
        observer.disconnect();
        observer = null;
    }
});
</script>

<style lang="scss" scoped>
.m-form-item {
    display: flex;
    &.m-form-item--top {
        flex-direction: column;
        .m-form-item__info {
            margin-bottom: 5px;
            width: 100%;
            text-align: left !important;
            .required-mark {
                margin-right: 2px;
            }
        }
    }
    &.m-form-item--left {
        align-items: var(--aligns);
        justify-content: var(--space);
        .m-form-item__info {
            position: relative;
            .required-mark {
                position: absolute;
                left: -10px;
            }
        }
    }
    .m-form-item__info {
        display: flex;
        align-items: center;
        position: relative;
        flex-shrink: 0; // 防止标签过长时挤压内容
        .required-mark {
            color: #f56c6c;
        }
        .m-form-item__label {
            font-size: inherit;
            color: #374151;
            font-weight: 500;
            text-wrap: nowrap; // 防止标签换行
            &.m-form-item__label--small {
                font-size: 14px;
            }
            &.m-form-item__label--medium {
                font-size: 16px;
            }
            &.m-form-item__label--large {
                font-size: 18px;
            }
        }
    }
    .m-form-item__content {
        position: relative;
        .m-form-item__error {
            position: absolute;
            color: #f56c6c;
            font-size: 12px;
            left: 5px;
        }
    }
}

.error-shake-enter-active {
    animation:
        shake 0.4s ease-in-out,
        fade-in 0.3s ease;
}

.error-shake-leave-active {
    transition: opacity 0.3s ease;
}

.error-shake-enter-from,
.error-shake-leave-to {
    opacity: 0;
}

@keyframes shake {
    0%,
    100% {
        transform: translateX(0);
    }
    10%,
    30%,
    50%,
    70%,
    90% {
        transform: translateX(-5px);
    }
    20%,
    40%,
    60%,
    80% {
        transform: translateX(5px);
    }
}
</style>
