<template>
    <MTooltip v-bind="tooltipProps" theme="light" ref="tooltipRef" @visible-change="onVisibleChange">
        <slot></slot>
        <template #content>
            <div class="popconfirm" :class="[`popconfirm--${variant}`]">
                <div class="popconfirm__header" v-if="title">
                    <MIcon :name="iconMap[variant]" :size="20"></MIcon>
                    <span class="popconfirm__title">{{ title }}</span>
                </div>

                <div class="popconfirm__body" v-if="message">
                    <span class="popconfirm__message">{{ message }}</span>
                </div>

                <div class="popconfirm__footer">
                    <MButton :variant="variant" v-if="showCancel" @click="onCancel" :disabled="loading" plain size="small" :icon="showIcon ? negativeIcon : ''">
                        {{ negativeText }}
                    </MButton>
                    <MButton :variant="variant" @click="onConfirm" :loading="loading" size="small" :icon="showIcon ? positiveIcon : ''">
                        {{ positiveText }}
                    </MButton>
                </div>
            </div>
        </template>
    </MTooltip>
</template>

<script lang="ts" setup>
import type { MTooltipInstance } from "@/components";
import { MButton, MIcon, MTooltip } from "@/components";
import { pick } from "lodash-es";
import { useTemplateRef } from "vue";
import type { MPopconfirmEmits, MPopconfirmInstance, MPopconfirmProps, MPopconfirmVariant } from "./types";

defineOptions({
    name: "MPopconfirm"
});

const props = withDefaults(defineProps<MPopconfirmProps>(), {
    placement: "bottom",
    trigger: "click",
    transition: "fade",
    showArrow: true,
    disabled: false,
    block: false,
    offset: 10,
    width: 250,
    variant: "primary",
    title: "提示",
    message: "确认要执行该操作吗？",
    positiveText: "确定",
    negativeText: "取消",
    positiveType: "primary",
    showCancel: true,
    showIcon: false,
    positiveIcon: "baocun",
    negativeIcon: "cancel2",
    loading: false
});
const tooltipProps = pick(props, ["placement", "trigger", "transition", "showArrow", "disabled", "block", "offset", "width", "popperStyle"]);
const emits = defineEmits<MPopconfirmEmits>();
const tooltipRef = useTemplateRef<MTooltipInstance>("tooltipRef");

const iconMap: Record<MPopconfirmVariant, string> = {
    primary: "bi:info-circle-fill",
    success: "ooui:success",
    warning: "streamline:warning-octagon-solid",
    danger: "zondicons:close-solid",
    info: "bi:info-circle-fill"
};

const onConfirm = async () => {
    if (props.onPositiveClick) {
        const result = await props.onPositiveClick();
        if (result) {
            tooltipRef.value?.hide();
        }
    } else {
        tooltipRef.value?.hide();
    }
};

const onCancel = () => {
    props.onNegativeClick?.();
    tooltipRef.value?.hide();
};

const onVisibleChange = (visible: boolean) => {
    emits("visible-change", visible);
};

defineExpose<MPopconfirmInstance>({
    show: () => tooltipRef.value?.show(),
    hide: () => tooltipRef.value?.hide(),
    toggle: () => tooltipRef.value?.toggle()
});
</script>

<style lang="scss" scoped>
.popconfirm {
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border-radius: 6px;
    border: 1px solid rgb(220, 223, 230);
    box-shadow: 6px 6px 12px rgba(0, 0, 0, 0.15);
    padding: 8px 12px;
    &.popconfirm--primary .popconfirm__header :deep(.m-icon) {
        color: #409eff;
    }
    &.popconfirm--success .popconfirm__header :deep(.m-icon) {
        color: #67c23a;
    }
    &.popconfirm--warning .popconfirm__header :deep(.m-icon) {
        color: #e6a23c;
    }
    &.popconfirm--danger .popconfirm__header :deep(.m-icon) {
        color: #f56c6c;
    }
    &.popconfirm--info .popconfirm__header :deep(.m-icon) {
        color: #17a2b8;
    }

    .popconfirm__header {
        display: flex;
        align-items: center;
        gap: 5px;
        margin-bottom: 5px;
        .popconfirm__title {
            font-size: 15px;
            font-weight: 500;
            color: #1f2937;
        }
    }
    .popconfirm__body {
        display: flex;
        align-items: center;
        padding-left: 25px;
        margin-bottom: 14px;
        .popconfirm__message {
            font-size: 14px;
            white-space: pre-wrap;
            word-break: break-word;
            color: #6b7280;
            line-height: 1.5;
        }
    }
    .popconfirm__footer {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
    }
}
</style>
