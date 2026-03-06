<template>
    <div
        class="m-checkbox-group"
        :class="[
            `m-checkbox-group--${customSize}`,
            {
                'm-checkbox-group--vertical': props.vertical
            }
        ]"
        :style="{
            gap: type === 'button' ? 0 : `${gap}px`
        }">
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
import type { FormContext, FormItemContext } from "@/components";
import { FormContextKey, FormItemContextKey } from "@/components";
import { computed, inject, provide, shallowReactive } from "vue";
import type { CheckBoxGroupContext, CheckBoxGroupEmits, CheckBoxGroupInstance, CheckBoxGroupProps } from "./types";
import { CheckBoxGroupContextKey } from "./types";

defineOptions({
    name: "MCheckBoxGroup"
});
const props = withDefaults(defineProps<CheckBoxGroupProps>(), {
    disabled: false,
    variant: "default",
    vertical: false,
    size: "medium",
    type: "box"
});
const emits = defineEmits<CheckBoxGroupEmits>();

const checkedValues = defineModel<Array<string | number>>("modelValue", {
    default: []
});
const valueSet = shallowReactive<Set<string | number>>(new Set(checkedValues.value)); // 选中值
const toggleSet = shallowReactive<Set<string | number>>(new Set()); // 所有值
const formItemContext = inject<FormItemContext | null>(FormItemContextKey, null);
const formContext = inject<FormContext | null>(FormContextKey, null);
const customSize = computed(() => {
    return formItemContext?.size || props.size;
});
if (formItemContext && formItemContext.prop) {
    formContext?.registerResetHandler(formItemContext.prop, () => {
        checkedValues.value = [];
        valueSet.clear();
        formItemContext?.resetValidate();
    });
}

// 注册切换函数
const register = (value: string | number) => {
    toggleSet.add(value);
};

// 切换选中状态
const toggle = (value: string | number) => {
    if (valueSet.has(value)) {
        valueSet.delete(value);
    } else {
        valueSet.add(value);
    }
    const currentValues = Array.from(valueSet);
    checkedValues.value = currentValues;
    emits("change");
};

// 判断是否选中
const isChecked = (value: string | number) => {
    return valueSet.has(value);
};

provide<CheckBoxGroupContext>(CheckBoxGroupContextKey, {
    disabled: props.disabled,
    size: formItemContext?.size || props.size,
    variant: props.variant,
    type: props.type || "box",
    toggle,
    isChecked,
    register
});

defineExpose<CheckBoxGroupInstance>({
    checkAll: () => {
        toggleSet.forEach(value => {
            valueSet.add(value);
        });
        checkedValues.value = Array.from(valueSet);
        emits("change");
    },
    uncheckAll: () => {
        valueSet.clear();
        checkedValues.value = [];
        emits("change");
    }
});
</script>

<style lang="scss" scoped>
.m-checkbox-group {
    display: inline-flex;
    flex-wrap: nowrap;
    align-items: center;
    flex-shrink: 0;
    &.m-checkbox-group--vertical {
        flex-direction: column;
    }
    // 不同尺寸的组间距
    &.m-checkbox-group--small {
        gap: 12px;
        &.m-checkbox-group--vertical {
            gap: 6px;
        }
    }
    &.m-checkbox-group--medium {
        gap: 16px;
        &.m-checkbox-group--vertical {
            gap: 8px;
        }
    }
    &.m-checkbox-group--large {
        gap: 20px;
        &.m-checkbox-group--vertical {
            gap: 12px;
        }
    }
}
</style>
