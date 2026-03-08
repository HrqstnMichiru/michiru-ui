<template>
    <MTooltip v-bind="tooltipProps" theme="light" ref="tooltipRef" @visible-change="onVisibleChange">
        <slot></slot>
        <template #content>
            <MCard v-bind="cardProps" @action-click="onActionClick" :content-style="contentStyle" :header-style="headerStyle">
                <template #header v-if="slots.header">
                    <slot name="header"></slot>
                </template>
                <slot name="content">{{ content }}</slot>
                <template #footer v-if="slots.footer">
                    <slot name="footer"></slot>
                </template>
            </MCard>
        </template>
    </MTooltip>
</template>

<script lang="ts" setup>
import type { MTooltipInstance } from "@/components";
import { MCard, MTooltip } from "@/components";
import { pick } from "lodash-es";
import { useSlots, useTemplateRef } from "vue";
import type { MPopoverEmits, MPopoverInstance, MPopoverProps } from "./types";

defineOptions({
    name: "MPopover"
});
const props = withDefaults(defineProps<MPopoverProps>(), {
    placement: "bottom",
    trigger: "hover",
    transition: "fade",
    showArrow: true,
    disabled: false,
    block: false,
    offset: 10,
    timer: 100
});
const tooltipProps = pick(props, ["placement", "trigger", "transition", "showArrow", "disabled", "block", "offset", "timer", "width"]);
const cardProps = pick(props, ["center", "title", "icon", "action", "footerStyle", "iconVariant", "iconColor"]);
const headerStyle = {
    fontSize: "18px",
    padding: "8px 12px",
    ...props.headerStyle
};
const contentStyle = {
    minWidth: "200px",
    fontSize: "14px",
    padding: "12px 20px",
    ...props.contentStyle
};
const slots = useSlots();
const emits = defineEmits<MPopoverEmits>();
const tooltipRef = useTemplateRef<MTooltipInstance>("tooltipRef");

const onActionClick = () => {
    emits("action-click");
};
const onVisibleChange = (visible: boolean) => {
    emits("visible-change", visible);
};

defineExpose<MPopoverInstance>({
    show: () => tooltipRef.value?.show(),
    hide: () => tooltipRef.value?.hide(),
    toggle: () => tooltipRef.value?.toggle()
});
</script>

<style lang="scss" scoped></style>
