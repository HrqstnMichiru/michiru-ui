<template>
    <div class="m-breadcrumb-item">
        <span class="text" @click="onClick" :class="{ 'is-disabled': disabled }">{{ text }}</span>
        <span class="separator">
            {{ breadcrumbContext?.separator }}
        </span>
    </div>
</template>

<script lang="ts" setup>
import { inject } from "vue";
import { useRouter } from "vue-router";
import type { BreadcrumbContext, BreadcrumbItemEmits, BreadcrumbItemProps } from "./types";
import { BreadcrumbContextKey } from "./types";

const router = useRouter();

defineOptions({
    name: "MBreadcrumbItem"
});
const props = defineProps<BreadcrumbItemProps>();
const emits = defineEmits<BreadcrumbItemEmits>();
const breadcrumbContext = inject<BreadcrumbContext>(BreadcrumbContextKey);

const onClick = () => {
    if (props.disabled) return;
    emits("click");
    if (props.to) {
        let path = props.to;
        if (!path.startsWith("/")) {
            path = `/${path}`;
        }
        router.push(path);
    }
};
</script>

<style lang="scss" scoped>
.m-breadcrumb-item {
    display: flex;
    align-items: center;
    .text {
        cursor: pointer;
        color: rgb(128, 30, 255);
        position: relative;
        &.is-disabled {
            cursor: not-allowed;
            color: #c0c4cc;
        }
        &::before {
            content: "";
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 1px;
            background-color: rgb(128, 30, 255);
            transform: scaleX(0);
            transform-origin: right;
            transition: transform 0.3s ease;
        }
        &:hover::before {
            transform: scaleX(1);
            transform-origin: left;
        }
    }
    .separator {
        margin: 0 6px;
        color: #85898f;
    }
    &:last-child {
        .text {
            color: #374151;
            transition: color 0.3s ease;
            &.is-disabled {
                cursor: not-allowed;
                color: #c0c4cc;
            }
            &:hover {
                color: rgb(128, 30, 255);
            }
        }
        .separator {
            display: none;
        }
    }
}
</style>
