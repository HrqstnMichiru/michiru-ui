<template>
    <span class="m-icon">
        <Icon
            :icon="name"
            :style="{
                color: color ? color : 'inherit',
                fontSize: size ? `${size}px` : 'inherit'
            }"></Icon>
    </span>
</template>

<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import type { MIconProps } from "./types";

defineOptions({
    name: "MIcon"
});
const props = defineProps<MIconProps>();
</script>

<style lang="scss" scoped>
.m-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: inherit;
    font-size: inherit;
}
</style>
