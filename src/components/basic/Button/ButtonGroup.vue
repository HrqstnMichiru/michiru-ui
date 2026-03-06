<template>
    <div
        class="m-btn-group"
        :style="{
            flexDirection: vertical ? 'column' : 'row'
        }">
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
import { provide } from "vue";
import type { ButtonGroupContext, ButtonGroupProps } from "./types";
import { ButtonGroupContextKey } from "./types";

defineOptions({
    name: "MButtonGroup"
});
const props = withDefaults(defineProps<ButtonGroupProps>(), {
    size: "medium",
    variant: "primary",
    disabled: false,
    vertical: false,
    plain: false
});

provide<ButtonGroupContext>(ButtonGroupContextKey, {
    size: props.size,
    variant: props.variant,
    disabled: props.disabled,
    plain: props.plain,
    vertical: props.vertical,
    outline: props.outline
});
</script>

<style lang="scss" scoped>
.m-btn-group {
    display: inline-flex;
    width: fit-content;
}
</style>
