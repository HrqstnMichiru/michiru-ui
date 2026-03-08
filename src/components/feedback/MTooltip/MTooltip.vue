<template>
    <div
        class="tooltip"
        :style="{
            width: block ? '100%' : 'auto',
            justifyContent: justifyContent
        }">
        <div
            class="tooltip__trigger"
            ref="triggerNode"
            v-on="triggerEvents"
            :style="{
                width: block ? '100%' : 'auto',
                justifyContent: justifyContent
            }">
            <slot></slot>
        </div>
        <Transition :name="transition">
            <div v-show="visible" class="tooltip__popper" :class="[`placement-${props.placement}`, `tooltip__popper--${theme}`]" ref="popperNode" :style="popperStyle" v-on="popperEvents">
                <slot name="content">
                    <div class="tooltip__content">{{ content }}</div>
                </slot>
                <div class="tooltip__arrow" v-if="showArrow"></div>
            </div>
        </Transition>
    </div>
</template>

<script lang="ts" setup>
import { debounce } from "lodash-es";
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, useTemplateRef } from "vue";
import type { MTooltipEmits, MTooltipInstance, MTooltipProps } from "./types";

defineOptions({
    name: "MTooltip"
});
const props = withDefaults(defineProps<MTooltipProps>(), {
    placement: "bottom",
    trigger: "hover",
    transition: "fade",
    showArrow: true,
    disabled: false,
    block: false,
    theme: "dark",
    offset: 10,
    timer: 100,
    zIndex: 1000,
    triggerAlign: "center"
});
const emits = defineEmits<MTooltipEmits>();
const visible = ref<boolean>(false);
const triggerEvents: Record<string, any> = reactive({});
const popperEvents: Record<string, any> = reactive({});
const popperStyle = ref({
    top: "0px",
    left: "0px",
    zIndex: `${props.zIndex}`,
    width: `${props.width}px`
});
const triggerNode = useTemplateRef<HTMLDivElement>("triggerNode");
const popperNode = useTemplateRef<HTMLDivElement>("popperNode");
let hideTimer: number | null = null;
const ratio = computed(() => {
    if (props.transition === "unfold") {
        return 0.3;
    }
    return 1;
});
const justifyContent = computed(() => {
    switch (props.triggerAlign) {
        case "start":
            return "flex-start";
        case "end":
            return "flex-end";
        case "center":
        default:
            return "center";
    }
});

const updatePopperPosition = (triggerRect: DOMRect, popperRect: DOMRect, offset: number = 0) => {
    let top = 0;
    let left = 0;

    switch (props.placement) {
        // ===== TOP =====
        case "top":
            top = -popperRect.height / ratio.value - offset;
            left = (triggerRect.width - popperRect.width) / 2;
            break;
        case "top-start":
            top = -popperRect.height / ratio.value - offset;
            left = 0;
            break;
        case "top-end":
            top = -popperRect.height / ratio.value - offset;
            left = triggerRect.width - popperRect.width;
            break;

        // ===== BOTTOM =====
        case "bottom":
            top = triggerRect.height + offset;
            left = (triggerRect.width - popperRect.width) / 2;
            break;
        case "bottom-start":
            top = triggerRect.height + offset;
            left = 0;
            break;
        case "bottom-end":
            top = triggerRect.height + offset;
            left = triggerRect.width - popperRect.width;
            break;

        // ===== LEFT =====
        case "left":
            top = (triggerRect.height - popperRect.height) / 2;
            left = -popperRect.width / ratio.value - offset;
            break;
        case "left-start":
            top = 0;
            left = -popperRect.width / ratio.value - offset;
            break;
        case "left-end":
            top = triggerRect.height - popperRect.height;
            left = -popperRect.width / ratio.value - offset;
            break;
        // ===== RIGHT =====
        case "right":
            top = (triggerRect.height - popperRect.height) / 2;
            left = triggerRect.width + offset;
            break;
        case "right-start":
            top = 0;
            left = triggerRect.width + offset;
            break;
        case "right-end":
            top = triggerRect.height - popperRect.height;
            left = triggerRect.width + offset;
            break;
    }
    return { top, left };
};

const show = () => {
    if (props.disabled) return;
    visible.value = true;
    emits("visible-change", true);
    nextTick(() => {
        if (!triggerNode.value || !popperNode.value) return;
        const triggerRect = triggerNode.value!.getBoundingClientRect();
        const popperRect = popperNode.value!.getBoundingClientRect();
        const { top, left } = updatePopperPosition(triggerRect, popperRect, props.offset);

        popperStyle.value.left = `${left}px`;
        popperStyle.value.top = `${top}px`;
    });
};
const debouncedShow = debounce(() => {
    show();
}, 50);
const finalShow = () => {
    debouncedHide.cancel();
    cancelHideTimer();
    debouncedShow();
};

const hide = () => {
    visible.value = false;
    emits("visible-change", false);
};
const debouncedHide = debounce(() => {
    hide();
}, 50);
const finalHide = () => {
    debouncedShow.cancel();
    debouncedHide();
};

const toggle = () => {
    if (visible.value) {
        finalHide();
    } else {
        finalShow();
    }
};
const startHideTimer = () => {
    cancelHideTimer();
    hideTimer = setTimeout(() => {
        finalHide();
    }, props.timer);
};
const cancelHideTimer = () => {
    if (hideTimer !== null) {
        clearTimeout(hideTimer);
        hideTimer = null;
    }
};

const cleanupEvents = () => {
    Object.keys(triggerEvents).forEach(event => {
        delete triggerEvents[event];
    });
    Object.keys(popperEvents).forEach(event => {
        delete popperEvents[event];
    });
    cancelHideTimer();
    if (props.trigger === "click" || props.trigger === "contextmenu") {
        document.removeEventListener("click", handleClickOutside);
    }
};

const handleClickOutside = (event: MouseEvent) => {
    if (!popperNode.value) return;
    if (popperNode.value.contains(event.target as HTMLElement)) return;
    if (triggerNode.value && triggerNode.value.contains(event.target as HTMLElement)) return;
    if (visible.value) {
        finalHide();
    }
};

const attachEvents = () => {
    if (props.trigger === "hover") {
        triggerEvents.mouseenter = finalShow;
        triggerEvents.mouseleave = startHideTimer;
        popperEvents.mouseenter = cancelHideTimer;
        popperEvents.mouseleave = startHideTimer;
    } else if (props.trigger === "click") {
        triggerEvents.click = toggle;

        document.addEventListener("click", handleClickOutside);
    } else if (props.trigger === "contextmenu") {
        triggerEvents.contextmenu = (event: MouseEvent) => {
            event.preventDefault();
            toggle();
        };
        document.addEventListener("click", handleClickOutside);
    }
};

onMounted(() => {
    if (props.trigger !== "manual") {
        attachEvents();
    }
});

onUnmounted(() => {
    if (props.trigger !== "manual") {
        cleanupEvents();
    }
});

defineExpose<MTooltipInstance>({
    show: finalShow,
    hide: finalHide,
    toggle
});
</script>

<style lang="scss" scoped>
.tooltip {
    position: relative;
    display: inline-flex;
    align-items: center;
    width: fit-content;
    .tooltip__trigger {
        position: relative;
        display: inline-flex;
        align-items: center;
        width: fit-content;
    }
}

.tooltip__popper {
    position: absolute;
    user-select: none;
    translate: 0 0;
    .tooltip__content {
        position: relative;
        background-color: #fff;
        border-radius: 6px;
        white-space: nowrap;
        border: 1px solid rgb(220, 223, 230);
        box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.12);
        font-size: 14px;
        padding: 8px 12px;
        color: rgb(96, 98, 102);
    }
    .tooltip__arrow {
        position: absolute;
        width: 8px;
        height: 8px;
        z-index: 0;
        &::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 8px;
            height: 8px;
            background: #fff;
            border: 1px solid rgb(220, 223, 230);
            transform: rotate(45deg);
            box-shadow: inherit;
        }
    }
    &.tooltip__popper--dark {
        .tooltip__content {
            background-color: #333;
            color: #fff;
            box-shadow: none;
            border-color: transparent;
        }
        .tooltip__arrow::before {
            background: #333;
            border-color: transparent;
        }
    }

    &.placement-top {
        transform-origin: center bottom;
        .tooltip__arrow {
            bottom: -2px;
            left: 50%;
            transform: translateX(-50%);
            clip-path: inset(50% -10px -10px -10px);
            &::before {
                border-left-color: transparent;
                border-top-color: transparent;
            }
        }
    }
    &.placement-top-start {
        transform-origin: left bottom;
        .tooltip__arrow {
            bottom: -2px;
            left: 16px;
            clip-path: inset(50% -10px -10px -10px);
            &::before {
                border-left-color: transparent;
                border-top-color: transparent;
            }
        }
    }
    &.placement-top-end {
        transform-origin: right bottom;
        .tooltip__arrow {
            bottom: -2px;
            right: 16px;
            clip-path: inset(50% -10px -10px -10px);
            &::before {
                border-left-color: transparent;
                border-top-color: transparent;
            }
        }
    }

    &.placement-bottom {
        transform-origin: center top;
        .tooltip__arrow {
            top: -4px;
            left: 50%;
            transform: translateX(-50%);
            clip-path: inset(-10px -10px 35% -10px);
            &::before {
                border-right-color: transparent;
                border-bottom-color: transparent;
            }
        }
    }
    &.placement-bottom-start {
        transform-origin: left top;
        .tooltip__arrow {
            top: -4px;
            left: 16px;
            clip-path: inset(-10px -10px 35% -10px);
            &::before {
                border-right-color: transparent;
                border-bottom-color: transparent;
            }
        }
    }
    &.placement-bottom-end {
        transform-origin: right top;
        .tooltip__arrow {
            top: -4px;
            right: 16px;
            clip-path: inset(-10px -10px 35% -10px);
            &::before {
                border-right-color: transparent;
                border-bottom-color: transparent;
            }
        }
    }

    &.placement-left {
        transform-origin: right center;
        .tooltip__arrow {
            right: -2px;
            top: 50%;
            transform: translateY(-50%);
            clip-path: inset(-10px -10px -10px 50%);
            &::before {
                border-left-color: transparent;
                border-bottom-color: transparent;
            }
        }
    }
    &.placement-left-start {
        transform-origin: right top;
        .tooltip__arrow {
            right: -2px;
            top: 16px;
            clip-path: inset(-10px -10px -10px 50%);
            &::before {
                border-left-color: transparent;
                border-bottom-color: transparent;
            }
        }
    }
    &.placement-left-end {
        transform-origin: right bottom;
        .tooltip__arrow {
            right: -2px;
            bottom: 16px;
            clip-path: inset(-10px -10px -10px 50%);
            &::before {
                border-left-color: transparent;
                border-bottom-color: transparent;
            }
        }
    }

    &.placement-right {
        transform-origin: left center;
        .tooltip__arrow {
            left: -4px;
            top: 50%;
            transform: translateY(-50%);
            clip-path: inset(-10px 35% -10px -10px);
            &::before {
                border-right-color: transparent;
                border-top-color: transparent;
            }
        }
    }

    &.placement-right-start {
        transform-origin: left top;
        .tooltip__arrow {
            left: -4px;
            top: 16px;
            clip-path: inset(-10px 35% -10px -10px);
            &::before {
                border-right-color: transparent;
                border-top-color: transparent;
            }
        }
    }

    &.placement-right-end {
        transform-origin: left bottom;
        .tooltip__arrow {
            left: -4px;
            bottom: 16px;
            clip-path: inset(-10px 35% -10px -10px);
            &::before {
                border-right-color: transparent;
                border-top-color: transparent;
            }
        }
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 300ms var(--ease-in-out) 50ms;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.translate-enter-active,
.translate-leave-active {
    transition:
        opacity 300ms var(--ease-in-out),
        transform 300ms var(--ease-in-out);
}
.translate-enter-from,
.translate-leave-to {
    opacity: 0;
}
.translate-leave-from,
.translate-enter-to {
    opacity: 1;
    transform: translate(0, 0);
}

.unfold-leave-active,
.unfold-enter-active {
    transition:
        opacity 300ms var(--ease-in-out),
        transform 300ms var(--ease-in-out),
        scale 300ms var(--ease-in-out);
}
.unfold-enter-from,
.unfold-leave-to {
    opacity: 0;
}

.tooltip__popper {
    &.placement-top.unfold-enter-from,
    &.placement-top.unfold-leave-to,
    &.placement-top-start.unfold-enter-from,
    &.placement-top-start.unfold-leave-to,
    &.placement-top-end.unfold-enter-from,
    &.placement-top-end.unfold-leave-to {
        scale: 1 0.3;
        transform: translateY(8px);
    }

    &.placement-bottom.unfold-enter-from,
    &.placement-bottom.unfold-leave-to,
    &.placement-bottom-start.unfold-enter-from,
    &.placement-bottom-start.unfold-leave-to,
    &.placement-bottom-end.unfold-enter-from,
    &.placement-bottom-end.unfold-leave-to {
        scale: 1 0.3;
        transform: translateY(-8px);
    }

    &.placement-left.unfold-enter-from,
    &.placement-left.unfold-leave-to,
    &.placement-left-start.unfold-enter-from,
    &.placement-left-start.unfold-leave-to,
    &.placement-left-end.unfold-enter-from,
    &.placement-left-end.unfold-leave-to {
        scale: 0.3;
        transform: translateX(8px);
    }

    &.placement-right.unfold-enter-from,
    &.placement-right.unfold-leave-to,
    &.placement-right-start.unfold-enter-from,
    &.placement-right-start.unfold-leave-to,
    &.placement-right-end.unfold-enter-from,
    &.placement-right-end.unfold-leave-to {
        scale: 0.3;
        transform: translateX(-8px);
    }

    &.placement-top.translate-enter-from,
    &.placement-top.translate-leave-to,
    &.placement-top-start.translate-enter-from,
    &.placement-top-start.translate-leave-to,
    &.placement-top-end.translate-enter-from,
    &.placement-top-end.translate-leave-to {
        transform: translateY(8px);
    }

    &.placement-bottom.translate-enter-from,
    &.placement-bottom.translate-leave-to,
    &.placement-bottom-start.translate-enter-from,
    &.placement-bottom-start.translate-leave-to,
    &.placement-bottom-end.translate-enter-from,
    &.placement-bottom-end.translate-leave-to {
        transform: translateY(-8px);
    }

    &.placement-left.translate-enter-from,
    &.placement-left.translate-leave-to,
    &.placement-left-start.translate-enter-from,
    &.placement-left-start.translate-leave-to,
    &.placement-left-end.translate-enter-from,
    &.placement-left-end.translate-leave-to {
        transform: translateX(8px);
    }

    &.placement-right.translate-enter-from,
    &.placement-right.translate-leave-to,
    &.placement-right-start.translate-enter-from,
    &.placement-right-start.translate-leave-to,
    &.placement-right-end.translate-enter-from,
    &.placement-right-end.translate-leave-to {
        transform: translateX(-8px);
    }
}
</style>
