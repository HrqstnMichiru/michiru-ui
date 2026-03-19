import type { InjectionKey } from "vue";

export type MPlacement = "top" | "top-start" | "top-end" | "bottom" | "bottom-start" | "bottom-end" | "left" | "left-start" | "left-end" | "right" | "right-start" | "right-end";
export interface MTooltipProps {
    content?: string; // 内容
    trigger?: "hover" | "click" | "manual" | "contextmenu"; // 触发方式
    placement?: MPlacement; // 位置
    transition?: "fade" | "none" | "translate" | "unfold"; // 动画
    showArrow?: boolean; // 是否显示箭头
    disabled?: boolean; // 是否禁用
    block?: boolean; // 是否占满触发元素的宽度
    theme?: "light" | "dark"; // 主题
    offset?: number; // 偏移距离
    timer?: number; // 自动隐藏的延迟时间
    width?: number; // popper的宽度
    zIndex?: number; // z-index
    syncWidth?: boolean; // 同步popper和trigger的宽度
}
export interface MTooltipEmits {
    (e: "visible-change", visible: boolean): void;
}
export interface MTooltipInstance {
    show: () => void;
    hide: () => void;
    toggle: () => void;
}

export interface MTooltipProviderContext {
    register?: (id: string, parentId: string | null, hide: () => void) => void;
    unregister?: (id: string) => void;
    // 判断一个 ID 是否是另一个 ID 的子孙
    isDescendant?: (parentId: string, candidateId: string) => boolean;
    hideParent?: (id: string) => void;
    parentId: string | null;
}
export interface MTooltipProviderHandler {
    parentId: string | null;
    hide: () => void;
}
export const MTooltipProviderContextKey: InjectionKey<MTooltipProviderContext> = Symbol("MTooltipProviderContextKey");
