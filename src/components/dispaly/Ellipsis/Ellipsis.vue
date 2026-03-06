<template>
    <p
        class="text-ellipsis"
        :style="{
            '--text-lines': maxLines,
            'text-indent': indent ? '2em' : '0'
        }">
        <slot>{{ content }}</slot>
    </p>
</template>

<script lang="ts" setup>
import type { EllipsisProps } from "./types";

defineOptions({
    name: "MTextEllipsis"
});
const props = withDefaults(defineProps<EllipsisProps>(), {
    maxLines: 1
});
</script>

<style lang="scss" scoped>
.text-ellipsis {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: break-word;
    line-clamp: var(--text-lines);
    -webkit-line-clamp: var(--text-lines);
}
</style>
