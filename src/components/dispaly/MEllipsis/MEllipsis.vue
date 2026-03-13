<template>
    <MTooltip
        v-bind="{
            placement,
            syncWidth: true,
            disabled: !(tooltip && isOverflowing)
        }">
        <p
            ref="textRef"
            class="text-ellipsis"
            :style="{
                '--text-lines': maxLines,
                'text-indent': indent ? '2em' : '0'
            }">
            <slot></slot>
        </p>
        <template #content v-if="tooltip && isOverflowing">
            <div class="text-content">
                <slot></slot>
            </div>
        </template>
    </MTooltip>
</template>

<script lang="ts" setup>
import { MTooltip } from "@/components";
import { onMounted, onUnmounted, ref, useTemplateRef } from "vue";
import type { MEllipsisProps } from "./types";

defineOptions({
    name: "MTextEllipsis"
});
const props = withDefaults(defineProps<MEllipsisProps>(), {
    maxLines: 1,
    placement: "top"
});

const textRef = useTemplateRef<HTMLParagraphElement>("textRef");
const isOverflowing = ref(false);

const checkOverflow = () => {
    const el = textRef.value;
    if (!el) return;
    isOverflowing.value = el.scrollHeight > el.clientHeight;
};

let mutationObserver: MutationObserver | null = null;
onMounted(() => {
    if (!textRef.value) return;
    checkOverflow();
    mutationObserver = new MutationObserver(checkOverflow);
    mutationObserver.observe(textRef.value, { childList: true, characterData: true });
});
onUnmounted(() => {
    if (mutationObserver) {
        mutationObserver.disconnect();
        mutationObserver = null;
    }
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
.text-content {
    position: relative;
    border-radius: 6px;
    font-size: 13px;
    padding: 8px 12px;
    color: rgb(96, 98, 102);
    background-color: #333;
    color: #fff;
    box-shadow: none;
}
</style>
