<template>
    <component :is="!!tooltip ? MTooltip : 'div'" v-bind="!!tooltip ? { content: tooltip, placement, disabled } : {}">
        <button
            :class="[
                'm-icon-button',
                `m-icon-button--${size}`,
                {
                    'm-icon-button--disabled': disabled,
                    'm-icon-button--circle': circle
                }
            ]"
            :disabled="disabled"
            type="button"
            @click="handleClick">
            <MIcon :name="icon" :size="iconPixelSize" :color="color" />
        </button>
    </component>
</template>

<script lang="ts" setup>
import { MIcon, MTooltip } from "@/components";
import { computed } from "vue";
import type { MIconButtonEmits, MIconButtonProps } from "./types";

defineOptions({
    name: "MIconButton"
});
const props = withDefaults(defineProps<MIconButtonProps>(), {
    size: "medium",
    disabled: false,
    circle: false,
    tooltip: "",
    placement: "top"
});
const emits = defineEmits<MIconButtonEmits>();

const iconPixelSize = computed(() => {
    if (props.size === "small") return 16;
    if (props.size === "large") return 24;
    return 20;
});

const handleClick = () => {
    if (props.disabled) return;
    emits("click");
};
</script>

<style lang="scss" scoped>
.m-icon-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    outline: none;
    background: transparent;
    color: #606266;
    cursor: pointer;
    user-select: none;
    transition:
        background-color 0.2s var(--ease-in-out),
        color 0.2s var(--ease-in-out);

    &:hover {
        background-color: rgba(0, 0, 0, 0.1);
    }

    &.m-icon-button--disabled {
        cursor: not-allowed;
        opacity: 0.5;

        &:hover {
            background: transparent;
        }
    }

    &.m-icon-button--small {
        width: 28px;
        height: 28px;
        border-radius: 6px;
    }

    &.m-icon-button--medium {
        width: 34px;
        height: 34px;
        border-radius: 8px;
    }

    &.m-icon-button--large {
        width: 40px;
        height: 40px;
        border-radius: 10px;
    }

    &.m-icon-button--circle {
        border-radius: 50%;
    }
}
</style>
