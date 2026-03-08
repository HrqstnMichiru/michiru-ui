export type MPlacement = "top" | "top-start" | "top-end" | "bottom" | "bottom-start" | "bottom-end" | "left" | "left-start" | "left-end" | "right" | "right-start" | "right-end";

export interface MTooltipProps {
    content?: string; // 提示内容
    trigger?: "hover" | "click" | "manual" | "contextmenu"; // 触发方式
    placement?: MPlacement; // 位置
    transition?: "fade" | "unfold" | "none" | "translate"; // 动画效果
    showArrow?: boolean; // 是否显示箭头
    disabled?: boolean; // 是否禁用
    block?: boolean; // 是否为块级元素
    theme?: "light" | "dark"; // 主题风格
    offset?: number; // 偏移量
    timer?: number; // 延时显示时间，单位毫秒
    width?: number; // 提示框宽度
    zIndex?: number; // 提示框层级
    triggerAlign?: "start" | "center" | "end"; // 触发元素对齐方式
}

export interface MTooltipEmits {
    (e: "visible-change", visible: boolean): void;
}

export interface MTooltipInstance {
    show: () => void;
    hide: () => void;
    toggle: () => void;
}
