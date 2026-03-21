<template>
    <MOverlay @after-close="onAfterClose" ref="overlayRef" :maskClosable="maskClosable" :zIndex="zIndex" :transition="transition" :top="top" :center="center">
        <div @click.stop class="modal" ref="modalRef" :style="dialogStyle">
            <div
                class="modal__header"
                @mousedown.stop="onHeaderMouseDown"
                :style="{
                    cursor: draggable ? 'move' : 'default',
                    justifyContent: contentCenter ? 'center' : 'flex-start'
                }"
                v-if="header">
                <slot name="header">
                    <span class="modal__header--title">
                        {{ title }}
                    </span>
                </slot>
            </div>
            <MScrollBar class="modal__body" v-if="scrollable" :max-height="500" :style="contentStyle">
                <slot></slot>
            </MScrollBar>
            <div class="modal__body" v-else :style="contentStyle">
                <slot></slot>
            </div>
            <div
                class="modal__footer"
                v-if="footer"
                :style="{
                    justifyContent: contentCenter ? 'center' : 'flex-end'
                }">
                <slot name="footer">
                    <MButton variant="gray" outline :icon="showIcon ? negativeIcon : ''" @click="onCancel" :disabled="loading">{{ negativeText }}</MButton>
                    <MButton variant="primary" :icon="showIcon ? positiveIcon : ''" @click="onConfirm" :loading="loading">{{ positiveText }}</MButton>
                </slot>
            </div>
            <span v-if="closable" class="modal-close" @click="close"></span>
        </div>
    </MOverlay>
</template>

<script lang="ts" setup>
import type { MOverlayInstance } from "@/components";
import { MButton, MOverlay, MScrollBar } from "@/components";
import { computed, reactive, useTemplateRef } from "vue";
import type { MModalEmits, MModalInstance, MModalProps } from "./types";

defineOptions({
    name: "MModal"
});
const props = withDefaults(defineProps<MModalProps>(), {
    maskClosable: true,
    zIndex: 500,
    top: 100,
    center: false,
    transition: "fade-translate",
    closable: true,
    footer: true,
    header: true,
    draggable: false,
    fullscreen: false,
    contentCenter: false,
    loading: false,
    scrollable: false,
    positiveText: "确定",
    negativeText: "取消",
    positiveIcon: "mingcute:check-fill",
    negativeIcon: "icon-park-outline:close",
    showIcon: false
});

const emits = defineEmits<MModalEmits>();
const overlayRef = useTemplateRef<MOverlayInstance>("overlayRef");

const modalRef = useTemplateRef<HTMLDivElement>("modalRef");
const dragStart = reactive({ x: 0, y: 0, left: 0, top: 0 });
const dialogPosition = reactive({ left: 0, top: 0 });
const dialogSize = reactive({ width: 0, height: 0 });
const dialogStyle = computed(() => {
    const style: Record<string, any> = {};
    if (props.width) {
        style.width = `${props.width}px`;
    }
    if (props.fullscreen) {
        return {
            width: "100vw",
            height: "100vh",
            inset: 0,
            borderRadius: 0
        };
    }
    if (props.draggable) {
        if (dialogPosition.left) style.left = `${dialogPosition.left}px`;
        if (dialogPosition.top) style.top = `${dialogPosition.top}px`;
        style.position = "fixed";
    }

    return style;
});
const contentStyle = computed(() => {
    const style: Record<string, any> = { ...props.contentStyle };
    if (props.contentCenter) {
        style.justifyContent = "center";
    }
    return style;
});

const close = () => {
    if (props.loading) return;
    overlayRef.value?.close();
};

const onAfterClose = () => {
    dialogPosition.left = 0;
    dialogPosition.top = 0;
    dialogSize.width = 0;
    dialogSize.height = 0;
    emits("after-close");
};

const onConfirm = async () => {
    if (props.onPositiveClick) {
        const result = await props.onPositiveClick();
        if (result) {
            close();
        }
    } else {
        close();
    }
};

const onCancel = () => {
    props.onNegativeClick?.();
    close();
};

const onHeaderMouseDown = (event: MouseEvent) => {
    if (!props.draggable || props.fullscreen) return;

    const rect = modalRef.value?.getBoundingClientRect();
    if (rect) {
        dragStart.x = event.clientX;
        dragStart.y = event.clientY;
        dragStart.left = rect.left;
        dragStart.top = rect.top;
        dialogSize.width = rect.width;
        dialogSize.height = rect.height;
    }

    const onMouseMove = (e: MouseEvent) => {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;

        const currentWidth = dialogSize.width || modalRef.value?.offsetWidth || 0;
        const currentHeight = dialogSize.height || modalRef.value?.offsetHeight || 0;
        const maxLeft = Math.max(1, window.innerWidth - currentWidth);
        const maxTop = Math.max(1, window.innerHeight - currentHeight);

        const newLeft = Math.max(1, Math.min(maxLeft, dragStart.left + deltaX));
        const newTop = Math.max(1, Math.min(maxTop, dragStart.top + deltaY));

        dialogPosition.left = newLeft;
        dialogPosition.top = newTop;
    };

    const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    document.body.style.cursor = "move";
    document.body.style.userSelect = "none";
};

defineExpose<MModalInstance>({
    close,
    open: () => {
        overlayRef.value?.open();
    }
});
</script>

<style lang="scss" scoped>
.modal {
    box-shadow: 6px 6px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    min-width: 300px;
    max-height: calc(100vh - 48px);
    position: relative;
    border-radius: 8px;
    background-color: #fff;
    border: 1px solid rgb(220, 223, 230);
    overflow: hidden;
    .modal__header {
        display: flex;
        padding: 12px 16px 8px;
        align-items: center;
        width: 100%;
        border-bottom: 1px solid rgb(220, 223, 230);
        user-select: none;
        justify-content: flex-start;
        .modal__header--title {
            background: linear-gradient(90deg, #4096e1 0%, #7c3aed 50%, #f472b6 100%);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            font-size: 20px;
            font-weight: 600;
            line-height: 1.2;
        }
    }
    .modal__body {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 16px 24px;
        overflow: auto;
    }
    .modal__footer {
        display: flex;
        padding: 8px 12px 12px;
        gap: 12px;
        align-items: center;
        border-top: 1px solid rgb(220, 223, 230);
    }
    .modal-close {
        position: absolute;
        top: 2px;
        right: 2px;
        width: 22px;
        height: 22px;
        cursor: pointer;
        background-image: url("@/assets/image/k_hoshi.png");
        background-size: contain;
        background-repeat: no-repeat;
        transition: all 0.2s ease;
        opacity: 0.6;
        &:hover {
            opacity: 1;
            transform: rotate(45deg);
        }
    }
}
</style>
