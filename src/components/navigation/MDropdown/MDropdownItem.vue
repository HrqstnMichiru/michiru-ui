<template>
    <div
        @click="handleClick"
        class="m-dropdown-item"
        :class="{
            'is-disabled': disabled
        }">
        <div class="left">
            <MIcon :name="icon" v-if="icon" :size="20"></MIcon>
            <span class="label">{{ label }}</span>
        </div>
        <div class="right" v-if="slots.suffix">
            <slot name="suffix"></slot>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { MIcon } from "@/components";
import { inject, useSlots } from "vue";
import type { MDropdownContext, MDropdownItemEmits, MDropdownItemProps } from "./types";
import { MDropdownContextKey } from "./types";

defineOptions({
    name: "MDropdownItem"
});
const props = defineProps<MDropdownItemProps>();
const emits = defineEmits<MDropdownItemEmits>();
const slots = useSlots();

const dropdownContext = inject<MDropdownContext>(MDropdownContextKey);
const handleClick = () => {
    if (props.disabled) return;
    emits("click");
    dropdownContext?.hide();
};
</script>

<style lang="scss" scoped>
.m-dropdown-item {
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
</style>
