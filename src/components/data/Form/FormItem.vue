<template>
    <div class="m-form-item" :style="formItemStyle">
        <span
            class="m-form-item__info"
            :style="{
                marginRight: `${gap}px`
            }"
            v-if="label || visibleMark">
            <span v-if="visibleMark" class="required-mark" :class="[`${labelPosition}`]">*</span>
            <label class="m-form-item__label" :style="labelStyle" v-if="label" :class="`m-form-item__label--${size}`">
                {{ label }}
            </label>
        </span>
        <div
            class="m-form-item__content"
            ref="contentRef"
            :class="{
                'm-form-item__content--block': !space
            }"
            :style="{
                width: labelPosition === 'top' && block ? '100%' : 'auto'
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
import type { CSSProperties } from "vue";
import { computed, inject, onBeforeUnmount, onMounted, provide, ref, useTemplateRef } from "vue";
import type { FormContext, FormItemContext, FormItemProps } from "./types";
import { FormContextKey, FormItemContextKey } from "./types";

defineOptions({
    name: "MFormItem"
});
const props = withDefaults(defineProps<FormItemProps>(), {
    labelAlign: "left",
    labelPosition: "left",
    trigger: "blur",
    gap: 10,
    aligns: "center",
    block: false,
    space: false
});
const formContext = inject<FormContext | null>(FormContextKey, null);
const errorMessage = ref("");
const contentRef = useTemplateRef<HTMLDivElement>("contentRef");
const errorRef = useTemplateRef<HTMLParagraphElement>("errorRef");

const formItemStyle = computed(() => {
    if (props.labelPosition === "top") {
        return {
            flexDirection: "column",
            width: props.block ? "100%" : "fit-content"
        } as CSSProperties;
    } else {
        return {
            flexDirection: "row",
            alignItems: props.aligns, // 标签与内容的对齐方式
            width: props.block ? "100%" : "fit-content",
            justifyContent: props.space ? "space-between" : "flex-start"
        } as CSSProperties;
    }
});
const labelStyle = computed(() => {
    const style: CSSProperties = {};
    // 对齐方式
    if (props.labelAlign === "left") {
        style.justifyContent = "flex-start";
    } else if (props.labelAlign === "center") {
        style.justifyContent = "center";
    } else if (props.labelAlign === "right") {
        style.justifyContent = "flex-end";
    }
    // 宽度
    if (props.labelPosition === "top") {
        style.width = "100%";
        style.justifyContent = "left";
        style.marginBottom = "5px";
    } else {
        if (props.labelWidth) {
            style.width = `${props.labelWidth}px`;
        } else {
            style.width = "auto";
        }
    }

    return style;
});

const _validate = (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        if (!props.prop) {
            resolve();
            return;
        }
        if (!formContext || !formContext.rules) {
            resolve();
            return;
        }
        const rules = formContext.rules[props.prop];
        const value = formContext.model[props.prop];
        if (!rules || rules.length === 0) {
            resolve();
            return;
        }
        for (const rule of rules) {
            if (rule.type === "required") {
                if (value === "" || value === null || value === undefined || value.length === 0) {
                    reject(new Error(rule.message));
                }
            } else if (rule.type === "length") {
                const testValue = (value as string).trim();
                if (rule.min && testValue.length < rule.min) {
                    reject(new Error(rule.message));
                }
                if (rule.max && testValue.length > rule.max) {
                    reject(new Error(rule.message));
                }
            } else if (rule.type === "range") {
                const testValue = value as number;
                if (rule.min && testValue < rule.min) {
                    reject(new Error(rule.message));
                }
                if (rule.max && testValue > rule.max) {
                    reject(new Error(rule.message));
                }
            } else if (rule.type === "pattern") {
                const testValue = (value as string).trim();
                if (!rule.pattern.test(testValue)) {
                    reject(new Error(rule.message));
                }
            } else {
                const result = await rule.validator();
                if (!result) {
                    reject(new Error(rule.message));
                }
            }
        }
        resolve();
    });
};
const validate = async (): Promise<void> => {
    try {
        await _validate();
        errorMessage.value = "";
    } catch (error: any) {
        errorMessage.value = error.message;
        throw error;
    }
};
if (props.prop && formContext) {
    formContext.registerValidator(props.prop, validate);
}

provide<FormItemContext>(FormItemContextKey, {
    validate,
    trigger: props.trigger,
    prop: props.prop,
    size: props.size!,
    block: props.block && !props.space,
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
    font-size: inherit;
    .m-form-item__info {
        display: flex;
        align-items: center;
        position: relative;
        .required-mark {
            color: #f56c6c;
            &.left {
                position: absolute;
                left: -10px;
            }
            &.top {
                margin-right: 2px;
            }
        }
        .m-form-item__label {
            font-size: inherit;
            color: #374151;
            font-weight: 500;
            text-wrap: nowrap; // 防止标签换行
            display: flex;
            align-items: center;

            &.m-form-item__label--small {
                font-size: 15px;
            }
            &.m-form-item__label--medium {
                font-size: 17px;
            }
            &.m-form-item__label--large {
                font-size: 19px;
            }
        }
    }

    .m-form-item__content {
        position: relative;
        &.m-form-item__content--block {
            flex: 1;
        }
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
