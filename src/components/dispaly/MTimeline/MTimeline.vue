<template>
    <div class="timeline" :class="[`timeline--${mode}`]">
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
import type { MTimelineProps, MTimelineContext } from "./types";
import { MTimelineContextKey } from "./types";
import { provide } from "vue";

defineOptions({
    name: "MTimeline"
});

const props = withDefaults(defineProps<MTimelineProps>(), {
    mode: "alternate",
    timestampPosition: "bottom"
});

provide<MTimelineContext>(MTimelineContextKey, {
    mode: props.mode,
    timestampPosition: props.timestampPosition
});
</script>

<style lang="scss" scoped>
.timeline {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
}
</style>
