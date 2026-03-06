<template>
    <MTooltip
        ref="tooltipRef"
        @visible-change="visibleChange"
        :trigger="trigger"
        :placement="!!context ? 'right' : placement"
        :transition="transition"
        :block="!!context || block"
        :disabled="disabled"
        :trigger-align="!!context ? 'start' : 'center'"
        :show-arrow="!!context ? false : showArrow"
        :offset="offset"
        :timer="timer"
        :width="width"
        theme="light">
        <slot>
            <MDropdownItem :label="label" :icon="icon" :disabled="disabled">
                <template #suffix>
                    <MIcon name="material-symbols:arrow-forward-ios"></MIcon>
                </template>
            </MDropdownItem>
        </slot>
        <template #content>
            <div class="m-dropdown-menu">
                <slot name="menu"></slot>
            </div>
        </template>
    </MTooltip>
</template>

<script lang="ts" setup>
import type { MTooltipInstance } from "@/components";
import { MDropdownItem, MIcon, MTooltip } from "@/components";
import { inject, provide, useTemplateRef } from "vue";
import type { DropdownContext, DropdownEmits, DropdownInstance, DropdownProps } from "./types";
import { DropdownContextKey } from "./types";

defineOptions({
    name: "MDropdown"
});
const props = withDefaults(defineProps<DropdownProps>(), {
    hideAfterClick: true,
    trigger: "hover",
    placement: "bottom",
    transition: "translate",
    offset: 8,
    timer: 100,
    showArrow: true,
    width: 150
});
const emits = defineEmits<DropdownEmits>();
const context = inject<DropdownContext | null>(DropdownContextKey, null);
const tooltipRef = useTemplateRef<MTooltipInstance>("tooltipRef");

const visibleChange = (visible: boolean) => {
    emits("visible-change", visible);
};

provide<DropdownContext>(DropdownContextKey, {
    hide: () => {
        if (props.hideAfterClick) {
            tooltipRef.value?.hide();
        }
    }
});

defineExpose<DropdownInstance>({
    show: () => {
        tooltipRef.value?.show();
    },
    hide: () => {
        tooltipRef.value?.hide();
    },
    toggle: () => {
        tooltipRef.value?.toggle();
    }
});
</script>

<style lang="scss" scoped>
.m-dropdown-menu {
    display: flex;
    width: 100%;
    flex-direction: column;
    padding: 4px;
    background-color: #fff;
    border-radius: 6px;
    border: 1px solid rgb(220, 223, 230);
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.12);
}
</style>
