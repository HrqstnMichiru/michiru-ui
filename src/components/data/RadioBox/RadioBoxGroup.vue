<template>
    <div
        class="m-radiobox-group"
        :class="[
            `m-radiobox-group--${customSize}`,
            {
                'm-radiobox-group--vertical': props.vertical
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
import { computed, inject, provide } from "vue";
import type { RadioBoxGroupContext, RadioBoxGroupEmits, RadioBoxGroupProps } from "./types";
import { RadioBoxGroupContextKey } from "./types";

defineOptions({
    name: "MRadioBoxGroup"
});

const props = withDefaults(defineProps<RadioBoxGroupProps>(), {
    disabled: false,
    variant: "default",
    direction: "horizontal",
    type: "box",
    size: "medium"
});
const emits = defineEmits<RadioBoxGroupEmits>();

const checkedValue = defineModel<string | number>("modelValue");
const initialValue = checkedValue.value; // 记录初始值
const formItemContext = inject<FormItemContext | null>(FormItemContextKey, null);
const formContext = inject<FormContext | null>(FormContextKey, null);
const customSize = computed(() => {
    return formItemContext?.size || props.size;
});
if (formItemContext && formItemContext.prop) {
    formContext?.registerResetHandler(formItemContext.prop, () => {
        checkedValue.value = initialValue;
        formItemContext?.resetValidate();
    });
}

// 判断是否选中
const isChecked = (value: string | number) => {
    return checkedValue.value === value;
};
const toggleChecked = (value: string | number) => {
    if (checkedValue.value !== value) {
        checkedValue.value = value;
        emits("change");
    }
};

provide<RadioBoxGroupContext>(RadioBoxGroupContextKey, {
    disabled: props.disabled,
    size: customSize.value,
    variant: props.variant,
    type: props.type,
    isChecked,
    toggleChecked
});
</script>

<style lang="scss" scoped>
.m-radiobox-group {
    display: flex;
    flex-wrap: nowrap;
    position: relative;
    align-items: center;
    &.m-radiobox-group--vertical {
        flex-direction: column;
    }
    // 不同尺寸的组间距
    &.m-radiobox-group--small {
        gap: 12px;
        &.m-radiobox-group--vertical {
            gap: 6px;
        }
    }
    &.m-radiobox-group--medium {
        gap: 16px;
        &.m-radiobox-group--vertical {
            gap: 8px;
        }
    }
    &.m-radiobox-group--large {
        gap: 20px;
        &.m-radiobox-group--vertical {
            gap: 12px;
        }
    }
}
</style>
