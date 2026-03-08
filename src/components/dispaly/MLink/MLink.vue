<template>
    <span
        class="link"
        :class="{
            'link--underline': underline,
            'link--disabled': disabled
        }"
        :style="{
            '--underline-color': `linear-gradient(${color}, ${color})`,
            '--link-color': color
        }"
        @click="handleClick">
        <slot></slot>
    </span>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import type { MLinkProps } from "./types";

const router = useRouter();

defineOptions({
    name: "MLink"
});
const props = withDefaults(defineProps<MLinkProps>(), {
    underline: false,
    disabled: false
});

const handleClick = () => {
    if (props.disabled) return;
    if (props.external && props.href) {
        window.open(props.href, "_blank");
    } else if (props.href) {
        router.push(props.href);
    }
};
</script>

<style lang="scss" scoped>
.link {
    cursor: pointer;
    width: fit-content;
    color: inherit;
    font-size: inherit;
    transition:
        background-size 0.3s ease-in-out,
        color 0.3s ease;
    background-position: right bottom;
    background-size: 0 1px;
    background-repeat: no-repeat;
    background-image: var(--underline-color);
    &:hover {
        color: var(--link-color);
    }
    &.link--underline:hover {
        background-position: left bottom;
        background-size: 100% 1px;
    }
    &.link--disabled {
        cursor: not-allowed;
        opacity: 0.5;
        color: #c0c4cc;
        &:hover {
            color: #c0c4cc;
            background-size: 0 1px;
        }
    }
}
</style>
