<template>
    <MTooltip
        ref="tooltipRef"
        @visible-change="visibleChange"
        :trigger="trigger"
        :placement="!!context ? 'right' : placement"
        :transition="transition"
        :block="!!context || block"
        :disabled="disabled"
        :show-arrow="!!context ? false : showArrow"
        :offset="offset"
        :width="width"
        theme="light">
        <slot>
            <div
                class="m-sub-dropdown"
                :class="{
                    'is-disabled': disabled
                }">
                <div class="left">
                    <MIcon :name="icon" v-if="icon" :size="20"></MIcon>
                    <span class="label">{{ label }}</span>
                </div>
                <div class="right">
                    <MIcon name="material-symbols:arrow-forward-ios"></MIcon>
                </div>
            </div>
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
import { MIcon, MTooltip } from "@/components";
import { inject, provide, useTemplateRef } from "vue";
import type { MDropdownContext, MDropdownEmits, MDropdownInstance, MDropdownProps } from "./types";
import { MDropdownContextKey } from "./types";

defineOptions({
    name: "MDropdown"
});
const props = withDefaults(defineProps<MDropdownProps>(), {
    hideAfterClick: true,
    trigger: "hover",
    placement: "bottom",
    transition: "translate",
    offset: 8,
    showArrow: true
});
const emits = defineEmits<MDropdownEmits>();
const context = inject<MDropdownContext | null>(MDropdownContextKey, null);
const tooltipRef = useTemplateRef<MTooltipInstance>("tooltipRef");

const visibleChange = (visible: boolean) => {
    emits("visible-change", visible);
};

provide<MDropdownContext>(MDropdownContextKey, {
    hide: () => {
        if (props.hideAfterClick) {
            tooltipRef.value?.hide();
            context?.hide();
        }
    }
});

defineExpose<MDropdownInstance>({
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
    .m-sub-dropdown {
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        white-space: nowrap;
        padding: 0 8px;
        border-radius: 6px;
        transition: background-color 0.2s ease;
        position: relative;
        width: 100%;
        .left,
        .right {
            display: inline-flex;
            align-items: center;
            color: #666;
            height: 36px;
            font-size: 16px;
            transition: color 0.2s ease;
        }
        .left {
            gap: 8px;
            flex: 1;
            .label {
                transition: color 0.2s ease;
                flex: 1;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                user-select: none;
            }
        }
        .right {
            margin-left: 20px;
        }
        &:hover {
            background-color: rgba(0, 0, 0, 0.08);
            .left,
            .right {
                color: #801eff;
            }
        }
        &.is-disabled {
            color: #a8abb2;
            cursor: not-allowed;
            .left,
            .right {
                color: #a8abb2;
            }
            &:hover {
                background: none;
                .left,
                .right {
                    color: #a8abb2;
                }
            }
        }
    }
}
</style>
