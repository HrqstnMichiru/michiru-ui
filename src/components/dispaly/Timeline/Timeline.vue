<template>
    <div class="timeline" :class="[`timeline--${mode}`]">
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
import type { TimelineProps, TimelineContext } from "./types";
import { TimelineContextKey } from "./types";
import { provide } from "vue";

defineOptions({
    name: "MTimeline"
});

const props = withDefaults(defineProps<TimelineProps>(), {
    mode: "alternate",
    timestampPosition: "bottom"
});

provide<TimelineContext>(TimelineContextKey, {
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
