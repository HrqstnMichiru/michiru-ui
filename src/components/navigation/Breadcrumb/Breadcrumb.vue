<template>
    <div class="m-breadcrumb">
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
import { provide } from "vue";
import type { BreadcrumbContext, BreadcrumbProps } from "./types";
import { BreadcrumbContextKey } from "./types";

defineOptions({
    name: "MBreadcrumb"
});
const props = withDefaults(defineProps<BreadcrumbProps>(), {
    separator: "/"
});
provide<BreadcrumbContext>(BreadcrumbContextKey, {
    separator: props.separator,
});
</script>

<style lang="scss" scoped>
.m-breadcrumb {
    display: flex;
    align-items: center;
    border-left: 2px solid rgb(128, 30, 255);
    padding-left: 10px;
    font-size: 16px;
    height: 100%;
    font-weight: 500;
}
</style>
