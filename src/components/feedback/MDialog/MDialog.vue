<template>
    <MOverlay ref="overlayRef" center @after-close="onAfterClose" :maskClosable="maskClosable" :maskTheme="maskTheme" :zIndex="zIndex" :blurable="blurable" :transition="transition" :lock="lock">
        <div
            class="dialog"
            :class="[`dialog--${variant}`]"
            :style="{
                width: `${width}px`
            }"
            @click.stop>
            <div class="dialog__header" :class="{ 'dialog__header--center': contentCenter }">
                <div class="dialog-icon">
                    <MIcon :name="iconMap[variant]" :size="24"></MIcon>
                </div>
                <div class="dialog-title" v-if="title">
                    {{ title }}
                </div>
            </div>

            <div class="dialog__content" :class="{ 'dialog__content--center': contentCenter }">
                {{ message }}
            </div>

            <div class="dialog__footer" :class="{ 'dialog__footer--center': contentCenter }">
                <MButton v-if="showCancel" :variant="variant" @click="onCancel" plain :icon="showIcon ? negativeIcon : ''" :disabled="loading">
                    {{ negativeText }}
                </MButton>
                <MButton :variant="variant" @click="onConfirm" :loading="loading" :icon="showIcon ? positiveIcon : ''">
                    {{ positiveText }}
                </MButton>
            </div>
            <span v-if="closable" class="dialog-close" @click="onClose"></span>
        </div>
    </MOverlay>
</template>

<script lang="ts" setup>
import type { MOverlayInstance } from "@/components";
import { MButton, MIcon, MOverlay } from "@/components";
import { onMounted, useTemplateRef } from "vue";
import type { MDialogProps, MDialogVariant } from "./types";

defineOptions({
    name: "MDialog"
});
const props = withDefaults(defineProps<MDialogProps>(), {
    width: 420,
    zIndex: 2000,
    center: false,
    closable: true,
    variant: "primary",
    title: "提示",
    positiveText: "确定",
    negativeText: "取消",
    showCancel: false,
    positiveIcon: "baocun",
    negativeIcon: "cancel2",
    showIcon: false,
    maskClosable: true,
    maskTheme: "dark",
    blurable: false,
    transition: "fade-translate",
    lock: true
});
const overlayRef = useTemplateRef<MOverlayInstance>("overlayRef");
const iconMap: Record<MDialogVariant, string> = {
    primary: "bi:info-circle-fill",
    success: "ooui:success",
    warning: "streamline:warning-octagon-solid",
    danger: "zondicons:close-solid",
    info: "bi:info-circle-fill"
};

const onAfterClose = () => {
    props.onAfterClose?.();
    props.onDestroy();
};
const onClose = () => {
    if (overlayRef.value) {
        overlayRef.value.close();
    }
};
const onConfirm = async () => {
    if (props.onPositiveClick) {
        const result = await props.onPositiveClick();
        if (result) {
            onClose();
        }
    } else {
        onClose();
    }
};
const onCancel = () => {
    props.onNegativeClick?.();
    onClose();
};

onMounted(() => {
    if (overlayRef.value) {
        overlayRef.value.open();
    }
});
</script>

<style lang="scss" scoped>
.dialog {
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 6px 6px 12px rgba(0, 0, 0, 0.15);
    padding: 16px 20px;
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: linear-gradient(135deg, #faf5ff 0%, #fef3f2 50%, #f0f9ff 100%);

    &.dialog--primary .dialog-icon {
        color: #409eff;
        background: #d9ecff;
    }

    &.dialog--success .dialog-icon {
        color: #67c23a;
        background: #e1f3d8;
    }

    &.dialog--warning .dialog-icon {
        color: #e6a23c;
        background: #faecd8;
    }

    &.dialog--danger .dialog-icon {
        color: #f56c6c;
        background: #fde2e2;
    }

    &.dialog--info .dialog-icon {
        color: #17a2b8;
        background: #d4f0f5;
    }

    .dialog__header {
        display: flex;
        align-items: center;
        gap: 8px;

        &.dialog__header--center {
            justify-content: center;
        }
        .dialog-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            flex-shrink: 0;
            box-shadow: 0 0 8px rgba(0, 0, 0, 0.08);
        }
        .dialog-title {
            font-size: 20px;
            font-weight: 600;
            color: #303133;
            line-height: 1.4;
            flex: 1;
        }
    }
    .dialog__content {
        font-size: 15px;
        color: rgb(96, 98, 102);
        line-height: 1.6;
        word-break: break-word;
        padding-left: 48px;

        &.dialog__content--center {
            padding-left: 0;
            text-align: center;
        }
    }
    .dialog__footer {
        display: flex;
        gap: 12px;
        margin-top: 20px;
        justify-content: flex-end;

        &.dialog__footer--center {
            justify-content: center;
        }
    }
    .dialog-close {
        position: absolute;
        top: 6px;
        right: 6px;
        width: 24px;
        height: 24px;
        cursor: pointer;
        background-image: url("@/assets/image/k_hoshi.png");
        background-size: contain;
        background-repeat: no-repeat;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        opacity: 0.5;
        z-index: 2;

        &:hover {
            opacity: 1;
            transform: rotate(90deg) scale(1.1);
        }
    }
}
</style>
