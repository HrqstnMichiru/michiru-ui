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
import type { MFormContext, MFormItemContext } from "@/components/data/MForm/types";
import { MFormContextKey, MFormItemContextKey } from "@/components/data/MForm/types";
import { computed, inject, provide } from "vue";
import type { MRadioBoxGroupContext, MRadioBoxGroupEmits, MRadioBoxGroupProps } from "./types";
import { MRadioBoxGroupContextKey } from "./types";

defineOptions({
    name: "MRadioBoxGroup"
});

const props = withDefaults(defineProps<MRadioBoxGroupProps>(), {
    variant: "primary",
    type: "box"
});
const emits = defineEmits<MRadioBoxGroupEmits>();

const checkedValue = defineModel<string | number>("modelValue");
const formItemContext = inject<MFormItemContext | null>(MFormItemContextKey, null);
const formContext = inject<MFormContext | null>(MFormContextKey, null);
const customSize = computed(() => {
    return props.size || formItemContext?.size || "medium";
});
if (formItemContext && formItemContext.prop) {
    const initialValue = checkedValue.value;
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

provide<MRadioBoxGroupContext>(MRadioBoxGroupContextKey, {
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
