<template>
    <div
        class="tooltip"
        :style="{
            width: block ? '100%' : 'auto'
        }">
        <div
            class="tooltip__trigger"
            ref="triggerNode"
            v-on="triggerEvents"
            :style="{
                width: block ? '100%' : 'auto'
            }">
            <slot></slot>
        </div>
        <Teleport to="body">
            <Transition :name="transition">
                <div
                    v-show="visible"
                    ref="popperNode"
                    class="tooltip__popper"
                    :class="[`placement-${activePlacement}`, `tooltip__popper--${theme}`]"
                    :style="popperStyle"
                    v-on="popperEvents"
                    :data-tooltip-id="instanceId">
                    <slot name="content">
                        <div class="tooltip__content">{{ content }}</div>
                    </slot>
                    <div class="tooltip__arrow" v-if="showArrow"></div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script lang="ts" setup>
import { nanoid } from "nanoid";
import { inject, nextTick, onBeforeUnmount, onMounted, provide, reactive, ref, useTemplateRef } from "vue";
import type { MPlacement, MTooltipEmits, MTooltipInstance, MTooltipProps, MTooltipProviderContext } from "./types";
import { MTooltipProviderContextKey } from "./types";

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
    zIndex: 10000,
    syncWidth: false
});
const emits = defineEmits<MTooltipEmits>();

const visible = ref(false);
const activePlacement = ref<MPlacement>(props.placement); // 当前实际使用的 placement，可能会因为自动调整而与 props.placement 不同
const triggerEvents: Record<string, any> = reactive({});
const popperEvents: Record<string, any> = reactive({});
const popperStyle = ref<Record<string, string>>({
    top: "0px",
    left: "0px",
    zIndex: `${props.zIndex}`,
    "--m-tooltip-gap": `${props.offset}px`
});
const triggerNode = useTemplateRef<HTMLDivElement>("triggerNode");
const popperNode = useTemplateRef<HTMLDivElement>("popperNode");
const context = inject<MTooltipProviderContext | null>(MTooltipProviderContextKey, null);
const instanceId = nanoid(6); // 生成一个唯一 ID 用于在 MTooltipProvider 中注册
provide<MTooltipProviderContext>(MTooltipProviderContextKey, {
    register: context?.register,
    unregister: context?.unregister,
    isDescendant: context?.isDescendant,
    hideParent: context?.hideParent,
    parentId: instanceId
});

let positionListenersAttached = false; // 是否已绑定窗口事件监听器，用于更新 popper 位置
const VIEWPORT_PADDING = 8; // 用于避免 tooltip 紧贴窗口边缘

// 计算 popper 的位置
const updatePopperPosition = (placement: MPlacement, triggerRect: DOMRect, popperRect: DOMRect, offset: number = 0) => {
    const baseTop = triggerRect.top;
    const baseLeft = triggerRect.left;
    let top = 0;
    let left = 0;

    switch (placement) {
        case "top":
            top = baseTop - popperRect.height - offset;
            left = baseLeft + (triggerRect.width - popperRect.width) / 2;
            break;
        case "top-start":
            top = baseTop - popperRect.height - offset;
            left = baseLeft;
            break;
        case "top-end":
            top = baseTop - popperRect.height - offset;
            left = baseLeft + triggerRect.width - popperRect.width;
            break;
        case "bottom":
            top = baseTop + triggerRect.height + offset;
            left = baseLeft + (triggerRect.width - popperRect.width) / 2;
            break;
        case "bottom-start":
            top = baseTop + triggerRect.height + offset;
            left = baseLeft;
            break;
        case "bottom-end":
            top = baseTop + triggerRect.height + offset;
            left = baseLeft + triggerRect.width - popperRect.width;
            break;
        case "left":
            top = baseTop + (triggerRect.height - popperRect.height) / 2;
            left = baseLeft - popperRect.width - offset;
            break;
        case "left-start":
            top = baseTop;
            left = baseLeft - popperRect.width - offset;
            break;
        case "left-end":
            top = baseTop + triggerRect.height - popperRect.height;
            left = baseLeft - popperRect.width - offset;
            break;
        case "right":
            top = baseTop + (triggerRect.height - popperRect.height) / 2;
            left = baseLeft + triggerRect.width + offset;
            break;
        case "right-start":
            top = baseTop;
            left = baseLeft + triggerRect.width + offset;
            break;
        case "right-end":
            top = baseTop + triggerRect.height - popperRect.height;
            left = baseLeft + triggerRect.width + offset;
            break;
    }

    return { top, left };
};

// 获取 placement 的反向位置
const getOppositePlacement = (placement: MPlacement): MPlacement => {
    if (placement.startsWith("top")) return placement.replace("top", "bottom") as MPlacement;
    if (placement.startsWith("bottom")) return placement.replace("bottom", "top") as MPlacement;
    if (placement.startsWith("left")) return placement.replace("left", "right") as MPlacement;
    return placement.replace("right", "left") as MPlacement;
};

// 判断 popper 是否到达视口边缘并自动调整 placement
const adjustPlacementForViewport = (placement: MPlacement, top: number, left: number, popperRect: DOMRect) => {
    const viewportRight = window.innerWidth - VIEWPORT_PADDING;
    const viewportBottom = window.innerHeight - VIEWPORT_PADDING;

    if (placement.startsWith("top") && top < VIEWPORT_PADDING) return getOppositePlacement(placement);
    if (placement.startsWith("bottom") && top + popperRect.height > viewportBottom) return getOppositePlacement(placement);
    if (placement.startsWith("left") && left < VIEWPORT_PADDING) return getOppositePlacement(placement);
    if (placement.startsWith("right") && left + popperRect.width > viewportRight) return getOppositePlacement(placement);

    return placement;
};

// 将 popper 位置限制在视口内，避免 tooltip 紧贴窗口边缘
const clampToViewport = (top: number, left: number, popperRect: DOMRect) => {
    const clampedTop = Math.min(Math.max(top, VIEWPORT_PADDING), window.innerHeight - popperRect.height - VIEWPORT_PADDING);
    const clampedLeft = Math.min(Math.max(left, VIEWPORT_PADDING), window.innerWidth - popperRect.width - VIEWPORT_PADDING);

    return {
        top: clampedTop,
        left: clampedLeft
    };
};

// 计算并更新 popper 位置，考虑自动调整以适应视口
const syncPopperPosition = () => {
    if (!visible.value || !triggerNode.value || !popperNode.value) return;
    const triggerRect = triggerNode.value.getBoundingClientRect();

    const popperRect = popperNode.value.getBoundingClientRect();
    const initialPlacement = props.placement;
    const initialPosition = updatePopperPosition(initialPlacement, triggerRect, popperRect, props.offset);
    const nextPlacement = adjustPlacementForViewport(initialPlacement, initialPosition.top, initialPosition.left, popperRect);
    const nextPosition = updatePopperPosition(nextPlacement, triggerRect, popperRect, props.offset);
    const { top, left } = clampToViewport(nextPosition.top, nextPosition.left, popperRect);

    activePlacement.value = nextPlacement;
    popperStyle.value.left = `${left}px`;
    popperStyle.value.top = `${top}px`;
};

const initializePopperWidth = () => {
    if (!triggerNode.value || !popperNode.value) return;
    let nextWidth = "auto";
    if (props.syncWidth) {
        nextWidth = `${triggerNode.value.getBoundingClientRect().width}px`;
    } else if (props.width) {
        nextWidth = `${props.width}px`;
    }
    popperStyle.value.width = nextWidth;
    popperNode.value.style.width = nextWidth;
};

// 绑定窗口事件监听器以在窗口大小改变或滚动时更新 popper 位置
const attachPositionListeners = () => {
    if (positionListenersAttached) return;
    window.addEventListener("resize", syncPopperPosition, { passive: true }); // 使用 passive 选项以优化性能
    window.addEventListener("scroll", syncPopperPosition, true); // 开启事件捕获，以便在滚动容器内的元素时也能更新位置
    positionListenersAttached = true;
};

// 移除窗口事件监听器
const detachPositionListeners = () => {
    if (!positionListenersAttached) return;
    window.removeEventListener("resize", syncPopperPosition);
    window.removeEventListener("scroll", syncPopperPosition, true);
    positionListenersAttached = false;
};

const show = () => {
    if (props.disabled) return;
    visible.value = true;
    emits("visible-change", true);
    nextTick(() => {
        initializePopperWidth();
        syncPopperPosition();
        attachPositionListeners();
    });
};

const hide = () => {
    visible.value = false;
    detachPositionListeners();
    emits("visible-change", false);
};

const toggle = () => {
    if (visible.value) hide();
    else show();
};

const isTargetInside = (element: HTMLElement, node: HTMLElement) => {
    return node.contains(element);
};

const handleMouseLeave = (event: MouseEvent) => {
    if (!popperNode.value || !triggerNode.value) return;
    const target = event.relatedTarget as HTMLElement; // 鼠标移出后进入的新元素
    // 如果鼠标移到自己的 popper 上，或者移回 trigger 区域，则不立即隐藏
    if (isTargetInside(target, popperNode.value) || isTargetInside(target, triggerNode.value)) return;
    if (context) {
        const targetId = target.closest?.("[data-tooltip-id]")?.getAttribute("data-tooltip-id");
        // 移到自己的子孙级 popper 上，也不立即隐藏
        const isGoingToDescendant = targetId && context?.isDescendant?.(instanceId, targetId);
        if (isGoingToDescendant) return;
        // 如果移到父级 trigger 上，应该隐藏自己的 popper
        const isGoingToParent = targetId && context?.isDescendant?.(targetId, instanceId);
        if (isGoingToParent) {
            hide();
            return;
        }
        // 如果既没有移到子孙级 popper 和父级 trigger 上，则应该隐藏自己和所有父级 popper
        context.hideParent?.(instanceId);
    } else {
        hide();
    }
};

const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!popperNode.value || !triggerNode.value) return;
    // 如果点击发生在 trigger 或 popper 内部，则不隐藏
    if (isTargetInside(target, triggerNode.value) || isTargetInside(target, popperNode.value)) return;
    if (context) {
        // 如果点击发生在自己的子孙级 popper 内部，也不隐藏
        const targetId = target.closest?.("[data-tooltip-id]")?.getAttribute("data-tooltip-id");
        const isGoingToDescendant = targetId && context?.isDescendant?.(instanceId, targetId);
        if (isGoingToDescendant) return;
    }
    if (visible.value) hide();
};

const cleanupEvents = () => {
    Object.keys(triggerEvents).forEach(event => {
        delete triggerEvents[event];
    });
    Object.keys(popperEvents).forEach(event => {
        delete popperEvents[event];
    });
    if (props.trigger === "click" || props.trigger === "contextmenu") {
        document.removeEventListener("click", handleClickOutside);
    }
};

const attachEvents = () => {
    if (props.trigger === "hover") {
        triggerEvents.mouseenter = show; // 鼠标进入触发元素时显示 tooltip
        triggerEvents.mouseleave = handleMouseLeave;
        popperEvents.mouseenter = show; // 鼠标进入 tooltip 时保持显示
        popperEvents.mouseleave = handleMouseLeave;
    } else if (props.trigger === "click") {
        triggerEvents.click = toggle;
    } else if (props.trigger === "contextmenu") {
        triggerEvents.contextmenu = (event: MouseEvent) => {
            event.preventDefault();
            toggle();
        };
    }
    document.addEventListener("click", handleClickOutside);
};

onMounted(() => {
    if (context) {
        context.register?.(instanceId, context.parentId, hide);
    }
    if (props.trigger !== "manual") attachEvents();
});

onBeforeUnmount(() => {
    if (context) {
        context.unregister?.(instanceId);
    }
    if (props.trigger !== "manual") cleanupEvents();
    detachPositionListeners();
});

defineExpose<MTooltipInstance>({
    show,
    hide,
    toggle
});
</script>

<style lang="scss" scoped>
.tooltip {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    .tooltip__trigger {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }
}

.tooltip__popper {
    user-select: none;
    translate: 0 0;
    pointer-events: auto;
    position: fixed;
    isolation: isolate;

    &::before {
        content: "";
        position: absolute;
        pointer-events: auto;
        background: transparent;
    }

    &.placement-top::before,
    &.placement-top-start::before,
    &.placement-top-end::before {
        top: 100%;
        left: 0;
        right: 0;
        height: var(--m-tooltip-gap, 0px);
    }

    &.placement-bottom::before,
    &.placement-bottom-start::before,
    &.placement-bottom-end::before {
        bottom: 100%;
        left: 0;
        right: 0;
        height: var(--m-tooltip-gap, 0px);
    }

    &.placement-left::before,
    &.placement-left-start::before,
    &.placement-left-end::before {
        left: 100%;
        top: 0;
        bottom: 0;
        width: var(--m-tooltip-gap, 0px);
    }

    &.placement-right::before,
    &.placement-right-start::before,
    &.placement-right-end::before {
        right: 100%;
        top: 0;
        bottom: 0;
        width: var(--m-tooltip-gap, 0px);
    }

    .tooltip__content {
        position: relative;
        background-color: #fff;
        border-radius: 6px;
        white-space: nowrap;
        border: 1px solid rgb(220, 223, 230);
        box-shadow: 6px 6px 12px rgba(0, 0, 0, 0.15);
        font-size: 13px;
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

.tooltip__popper {
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

.unfold-enter-active,
.unfold-leave-active {
    transition:
        opacity 300ms var(--ease-in-out),
        transform 300ms var(--ease-in-out);
}

.unfold-enter-from,
.unfold-leave-to {
    opacity: 0;
}

.unfold-enter-to,
.unfold-leave-from {
    opacity: 1;
    transform: scale(1);
}

.tooltip__popper {
    &.placement-top.unfold-enter-from,
    &.placement-top.unfold-leave-to,
    &.placement-top-start.unfold-enter-from,
    &.placement-top-start.unfold-leave-to,
    &.placement-top-end.unfold-enter-from,
    &.placement-top-end.unfold-leave-to,
    &.placement-bottom.unfold-enter-from,
    &.placement-bottom.unfold-leave-to,
    &.placement-bottom-start.unfold-enter-from,
    &.placement-bottom-start.unfold-leave-to,
    &.placement-bottom-end.unfold-enter-from,
    &.placement-bottom-end.unfold-leave-to {
        transform: scaleY(0);
    }

    &.placement-left.unfold-enter-from,
    &.placement-left.unfold-leave-to,
    &.placement-left-start.unfold-enter-from,
    &.placement-left-start.unfold-leave-to,
    &.placement-left-end.unfold-enter-from,
    &.placement-left-end.unfold-leave-to,
    &.placement-right.unfold-enter-from,
    &.placement-right.unfold-leave-to,
    &.placement-right-start.unfold-enter-from,
    &.placement-right-start.unfold-leave-to,
    &.placement-right-end.unfold-enter-from,
    &.placement-right-end.unfold-leave-to {
        transform: scaleX(0);
    }
}
</style>
