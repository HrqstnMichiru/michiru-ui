<template>
    <span
        class="link"
        :class="[
            `link--${action}`,
            {
                'link--underline': underline,
                'link--disabled': disabled
            }
        ]"
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
    disabled: false,
    action: "hover"
});

const handleClick = () => {
    if (props.disabled) return;
    if (props.external) {
        window.open(props.href, "_blank");
    } else if (props.href) {
        router.push(props.href);
    }
};
</script>

<style lang="scss" scoped>
.link {
    cursor: pointer;
    color: inherit;
    font-size: inherit;
    transition:
        background-size 0.3s ease-in-out,
        color 0.3s ease;
    &.link--hover:hover {
        color: var(--link-color);
    }
    &.link--always {
        color: var(--link-color);
    }
    &.link--underline {
        background-repeat: no-repeat;
        background-image: var(--underline-color);
        &.link--hover {
            background-position: right bottom;
            background-size: 0 1px;
            &:hover {
                background-position: left bottom;
                background-size: 100% 1px;
            }
        }
        &.link--always {
            background-position: center bottom;
            background-size: 100% 1px;
        }
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
