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
import type { MFormContext, MFormItemContext } from "@/components/data/MForm/types";
import { MFormContextKey, MFormItemContextKey } from "@/components/data/MForm/types";
import { computed, inject, provide, shallowReactive } from "vue";
import type { MCheckBoxGroupContext, MCheckBoxGroupEmits, MCheckBoxGroupInstance, MCheckBoxGroupProps } from "./types";
import { MCheckBoxGroupContextKey } from "./types";

defineOptions({
    name: "MCheckBoxGroup"
});
const props = withDefaults(defineProps<MCheckBoxGroupProps>(), {
    variant: "primary",
    type: "box",
    bordered: false
});
const emits = defineEmits<MCheckBoxGroupEmits>();

const checkedValues = defineModel<Array<string | number>>("modelValue", {
    default: []
});
const valueSet = shallowReactive<Set<string | number>>(new Set(checkedValues.value)); // 选中值
const toggleSet = shallowReactive<Set<string | number>>(new Set()); // 所有值
const formItemContext = inject<MFormItemContext | null>(MFormItemContextKey, null);
const formContext = inject<MFormContext | null>(MFormContextKey, null);
const customSize = computed(() => {
    return props.size || formItemContext?.size || "medium";
});
if (formItemContext && formItemContext.prop) {
    formContext?.registerResetHandler(formItemContext.prop, () => {
        checkedValues.value = []; // 重置时清空选中值
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

provide<MCheckBoxGroupContext>(MCheckBoxGroupContextKey, {
    disabled: !!props.disabled,
    size: customSize.value,
    variant: props.variant,
    type: props.type || "box",
    bordered: (props.type || "box") === "box" && !!props.bordered,
    toggleChecked: toggle,
    isChecked,
    register
});

defineExpose<MCheckBoxGroupInstance>({
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
