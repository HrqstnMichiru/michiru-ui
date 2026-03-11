<template>
    <MOverlay v-bind="overlayProps" @after-close="onAfterClose" ref="overlayRef">
        <div
            @click.stop
            class="modal"
            ref="modalRef"
            :class="{
                'modal--fullscreen': fullscreen,
                'modal--resizable': resizable
            }"
            :style="dialogStyle">
            <div
                class="modal__header"
                @mousedown.stop="onHeaderMouseDown"
                :class="{
                    'modal__header--draggable': draggable,
                    'modal__header--centered': contentCenter
                }"
                :style="headerStyle">
                <slot name="header">
                    <span class="modal__header--title">
                        {{ title }}
                    </span>
                </slot>
            </div>
            <MScrollBar
                :max-height="500"
                class="modal__body"
                v-if="scrollable"
                :has-scroll-bar="showScrollbar"
                :style="contentStyle"
                :class="{
                    'modal__body--centered': contentCenter
                }">
                <slot></slot>
            </MScrollBar>
            <div
                class="modal__body"
                v-else
                :style="contentStyle"
                :class="{
                    'modal__body--centered': contentCenter
                }">
                <slot></slot>
            </div>
            <div
                class="modal__footer"
                v-if="footer"
                :style="{
                    justifyContent: contentCenter ? 'center' : 'flex-end'
                }">
                <slot name="footer">
                    <MButton variant="gray" outline :icon="showIcon ? negativeIcon : ''" @click="close" :disabled="loading" :icon-size="20">{{ negativeText }}</MButton>
                    <MButton variant="primary" :icon="showIcon ? positiveIcon : ''" @click="onConfirm" :loading="loading" :icon-size="20">{{ positiveText }}</MButton>
                </slot>
            </div>

            <div v-if="resizable && !fullscreen" class="modal-resize-on" @mousedown.stop.prevent="onResizeMouseDown"></div>
            <span v-if="closable" class="modal-close" @click="close"></span>
        </div>
    </MOverlay>
</template>

<script lang="ts" setup>
import type { MOverlayInstance } from "@/components";
import { MButton, MOverlay, MScrollBar } from "@/components";
import { pick } from "lodash-es";
import { computed, reactive, ref, useTemplateRef } from "vue";
import type { MModalEmits, MModalInstance, MModalProps } from "./types";

defineOptions({
    name: "MModal"
});
const props = withDefaults(defineProps<MModalProps>(), {
    // MOverlay Props
    maskClosable: true,
    maskTheme: "dark",
    zIndex: 500,
    top: 100,
    blurable: true,
    center: false,
    transition: "slide-down",
    lock: true,
    // MModal Props
    closable: true,
    footer: true,
    draggable: false,
    resizable: false,
    fullscreen: false,
    contentCenter: false,
    loading: false,
    scrollable: false,
    showScrollbar: true,
    positiveText: "确定",
    negativeText: "取消",
    positiveIcon: "mingcute:check-fill",
    negativeIcon: "icon-park-outline:close",
    showIcon: false
});
const overlayProps = pick(props, ["maskClosable", "maskTheme", "zIndex", "top", "blurable", "center", "transition", "lock"]);
const emits = defineEmits<MModalEmits>();
const overlayRef = useTemplateRef<MOverlayInstance>("overlayRef");

const modalRef = useTemplateRef<HTMLDivElement>("modalRef");
const dragStart = reactive({ x: 0, y: 0, left: 0, top: 0 });
const resizeStart = reactive({ x: 0, y: 0, width: 0, height: 0 });
const isResizing = ref<boolean>(false);
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
            inset: 0
        };
    }

    if (props.draggable) {
        if (dialogPosition.left) style.left = `${dialogPosition.left}px`;
        if (dialogPosition.top) style.top = `${dialogPosition.top}px`;
        style.transform = "none";
        style.position = "fixed";
    }

    if (props.resizable) {
        if (dialogSize.width) style.width = `${dialogSize.width}px`;
        if (dialogSize.height) style.height = `${dialogSize.height}px`;
    }

    return style;
});

const close = () => {
    if (props.loading) return;
    overlayRef.value?.close();
};
const lazyClose = () => {
    setTimeout(() => {
        overlayRef.value?.close();
    }, 500);
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

const onHeaderMouseDown = (event: MouseEvent) => {
    if (!props.draggable || props.fullscreen) return;

    const rect = modalRef.value?.getBoundingClientRect();
    if (rect) {
        dragStart.x = event.clientX;
        dragStart.y = event.clientY;
        dragStart.left = rect.left;
        dragStart.top = rect.top;
    }

    const onMouseMove = (e: MouseEvent) => {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;

        const newLeft = Math.max(0, Math.min(window.innerWidth - 300, dragStart.left + deltaX));
        const newTop = Math.max(0, Math.min(window.innerHeight - 200, dragStart.top + deltaY));

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

const onResizeMouseDown = (event: MouseEvent) => {
    if (!props.resizable || props.fullscreen) return;

    isResizing.value = true;
    const rect = modalRef.value?.getBoundingClientRect();
    if (rect) {
        resizeStart.x = event.clientX;
        resizeStart.y = event.clientY;
        resizeStart.width = rect.width;
        resizeStart.height = rect.height;
    }

    const onMouseMove = (e: MouseEvent) => {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        dialogSize.width = Math.max(300, resizeStart.width + deltaX);
        dialogSize.height = Math.max(200, resizeStart.height + deltaY);
    };

    const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        setTimeout(() => {
            isResizing.value = false;
        }, 500);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    document.body.style.cursor = "se-resize";
    document.body.style.userSelect = "none";
};

defineExpose<MModalInstance>({
    close,
    lazyClose,
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
    position: relative;
    border-radius: 8px;
    background-color: #fff;
    border: 1px solid rgb(220, 223, 230);
    &.modal--fullscreen {
        border-radius: 0;
    }
    &.modal--resizable {
        resize: none;
    }
    .modal__header {
        display: flex;
        padding: 12px 16px 8px;
        align-items: center;
        width: 100%;
        border-bottom: 1px solid rgb(220, 223, 230);
        user-select: none;
        justify-content: flex-start;
        &.modal__header--draggable {
            cursor: move;
        }
        &.modal__header--centered {
            justify-content: center;
        }
        .modal__header--title {
            background: linear-gradient(90deg, #4096e1 0%, #7c3aed 50%, #f472b6 100%);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            font-size: 20px;
            font-weight: 600;
            line-height: 1.4;
        }
    }
    .modal__body {
        display: flex;
        flex-direction: column;
        padding: 16px 24px;
        &.modal__body--centered {
            align-items: center;
            justify-content: center;
        }
    }
    .modal__footer {
        display: flex;
        padding: 12px 16px 16px;
        gap: 12px;
        align-items: center;
        border-top: 1px solid rgb(220, 223, 230);
    }
    .modal-resize-on {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 26px;
        height: 26px;
        cursor: se-resize;
        clip-path: polygon(100% 0, 100% 100%, 0 100%);
        background: repeating-linear-gradient(135deg, #3b82f6, #3b82f6 2px, transparent 2px, transparent 6px);
        opacity: 0.9;
        transition: opacity 0.2s ease;
        &:hover {
            opacity: 1;
        }
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
