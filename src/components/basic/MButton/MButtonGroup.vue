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
import type { MButtonGroupContext, MButtonGroupProps } from "./types";
import { MButtonGroupContextKey } from "./types";

defineOptions({
    name: "MButtonGroup"
});
const props = withDefaults(defineProps<MButtonGroupProps>(), {
    size: "medium",
    variant: "primary",
    disabled: false,
    vertical: false,
    plain: false
});

provide<MButtonGroupContext>(MButtonGroupContextKey, {
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
