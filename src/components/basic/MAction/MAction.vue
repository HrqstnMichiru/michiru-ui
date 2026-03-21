<template>
    <button
        :class="[
            'm-action',
            `m-action--${size}`,
            `m-action--${type}`,
            {
                'm-action--disabled': disabled,
                'm-action--hover': hoverable,
                'm-action--round': round && type === 'text',
                'm-action--circle': circle && type === 'icon'
            }
        ]"
        :disabled="disabled"
        type="button"
        @click="handleClick">
        <MIcon
            :name="action"
            v-if="type === 'icon'"
            class="m-action__icon"
            :style="{
                color: actionColor
            }" />
        <span
            class="m-action__text"
            :style="{
                color: actionColor
            }"
            v-else>
            {{ action }}
        </span>
    </button>
</template>

<script lang="ts" setup>
import { MIcon } from "@/components";
import { computed } from "vue";
import type { MActionEmits, MActionProps } from "./types";

defineOptions({
    name: "MAction"
});
const props = withDefaults(defineProps<MActionProps>(), {
    type: "text",
    size: "medium",
    disabled: false,
    round: false,
    circle: false,
    hoverable: true
});
const emits = defineEmits<MActionEmits>();

const variantColorMap: Record<NonNullable<MActionProps["variant"]>, string> = {
    primary: "#409eff",
    success: "#67c23a",
    warning: "#e6a23c",
    danger: "#f56c6c",
    info: "#13c2c2",
    purple: "#801eff",
    pink: "#ff69b4"
};
const actionColor = computed(() => {
    if (props.disabled) return undefined;
    if (props.color) return props.color;
    if (props.variant) return variantColorMap[props.variant];
    return undefined;
});

const handleClick = () => {
    if (props.disabled) return;
    emits("click");
};
</script>

<style lang="scss" scoped>
.m-action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    font-family: inherit;
    border: none;
    white-space: nowrap;
    cursor: pointer;
    transition: all 0.2s var(--ease-in-out);
    user-select: none;
    .m-action__text {
        font-weight: 500;
        color: rgb(123, 136, 142);
        line-height: 1.2;
    }
    .m-action__icon {
        font-weight: 400;
        color: rgb(123, 136, 142);
    }
    &.m-action--small {
        .m-action__text {
            font-size: 14px;
        }
        .m-action__icon {
            font-size: 20px;
        }
    }
    &.m-action--medium {
        .m-action__text {
            font-size: 16px;
        }
        .m-action__icon {
            font-size: 24px;
        }
    }
    &.m-action--large {
        .m-action__text {
            font-size: 18px;
        }
        .m-action__icon {
            font-size: 28px;
        }
    }
    &.m-action--hover:hover {
        background-color: rgba(0, 0, 0, 0.08);
    }
    &:not(.m-action--hover) {
        background-color: rgba(0, 0, 0, 0.08);
    }
    &.m-action--text {
        &.m-action--small {
            padding: 6px 10px;
            height: 28px;
            border-radius: 4px;
            .m-action__text {
                line-height: 16px;
            }
        }
        &.m-action--medium {
            padding: 8px 12px;
            height: 34px;
            border-radius: 6px;
            .m-action__text {
                line-height: 18px;
            }
        }
        &.m-action--large {
            padding: 10px 14px;
            height: 40px;
            border-radius: 8px;
            .m-action__text {
                line-height: 20px;
            }
        }
        &.m-action--round {
            border-radius: 20px !important;
        }
    }
    &.m-action--icon {
        padding: 6px;
        &.m-action--circle {
            border-radius: 50% !important;
        }
        &.m-action--small {
            width: 32px;
            height: 32px;
            border-radius: 4px;
        }
        &.m-action--medium {
            width: 38px;
            height: 38px;
            border-radius: 6px;
        }
        &.m-action--large {
            width: 42px;
            height: 42px;
            border-radius: 8px;
        }
    }
    &.m-action--disabled {
        cursor: not-allowed;
        color: #a8abb2 !important;
        .m-action__text,
        .m-action__icon {
            color: #a8abb2 !important;
        }
        &:hover,
        &:active {
            background-color: transparent;
        }
    }
}
</style>
