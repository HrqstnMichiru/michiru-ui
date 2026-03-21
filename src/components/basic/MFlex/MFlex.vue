<template>
    <div
        :style="{
            display: inline ? 'inline-flex' : 'flex',
            flexDirection: vertical ? 'column' : 'row',
            columnGap: `${gapX}px`,
            rowGap: `${gapY}px`,
            alignItems: wrap ? undefined : alignItemsValue,
            alignContent: wrap ? alignItemsValue : undefined,
            justifyContent: justifyContentValue,
            flexWrap: wrap ? 'wrap' : 'nowrap',
            marginLeft: offsetMargin,
            flex: flexValue,
            minWidth: 0
        }">
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
import { computed, inject, provide } from "vue";
import type { MFlexContext, MFlexProps } from "./types";
import { MFlexContextKey } from "./types";

defineOptions({
    name: "MFlex"
});
const props = withDefaults(defineProps<MFlexProps>(), {
    vertical: false,
    gap: 0,
    aligns: "stretch",
    justify: "start",
    wrap: false,
    offset: 0,
    inline: false,
    span: 0,
    fill: false
});

const parentFlexContext = inject<MFlexContext | null>(MFlexContextKey, null);

const gapX = computed(() => (Array.isArray(props.gap) ? props.gap[0] : props.gap));
const gapY = computed(() => (Array.isArray(props.gap) ? props.gap[1] : props.gap));
const gapForSpan = computed(() => (props.vertical ? 0 : gapX.value));
const parentGapForSpan = computed(() => parentFlexContext?.gapForSpan ?? 0);
const mapFlexAlignment = (value: string) => {
    switch (value) {
        case "start":
            return "flex-start";
        case "end":
            return "flex-end";
        case "around":
            return "space-around";
        case "between":
            return "space-between";
        default:
            return value;
    }
};
const alignItemsValue = computed(() => mapFlexAlignment(props.aligns));
const justifyContentValue = computed(() => mapFlexAlignment(props.justify));

provide(MFlexContextKey, {
    get gapForSpan() {
        return gapForSpan.value;
    }
});

const flexValue = computed(() => {
    if (props.fill) return "1";
    if (props.span <= 0) return "initial";
    const percent = (props.span / 24) * 100;
    const gapOffset = ((24 - props.span) / 24) * parentGapForSpan.value;
    return `0 0 calc(${percent}% - ${gapOffset}px)`;
});

const offsetMargin = computed(() => {
    if (props.offset <= 0) return "0px";
    const percent = (props.offset / 24) * 100;
    const gapAddition = (props.offset / 24) * parentGapForSpan.value;
    return `calc(${percent}% + ${gapAddition}px)`;
});
</script>
