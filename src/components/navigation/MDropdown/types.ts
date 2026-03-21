import type { MPlacement } from "@/components/feedback/MTooltip/types";
import type { InjectionKey } from "vue";

export interface MDropdownItemProps {
    label?: string;
    icon?: string;
    disabled?: boolean;
}
export interface MDropdownItemEmits {
    (e: "click"): void;
}

export interface MDropdownProps {
    hideAfterClick?: boolean; // 点击菜单项后是否隐藏
    trigger?: "hover" | "click" | "manual"; // 触发方式
    placement?: MPlacement; // 位置
    transition?: "fade" | "none" | "translate";
    block?: boolean; // 是否为块级元素
    disabled?: boolean; // 是否禁用
    width?: number; // 下拉菜单宽度
    showArrow?: boolean; // 是否显示箭头
    offset?: number; // 下拉菜单偏移量，单位px
    label?: string; // 触发元素文本
    icon?: string; // 触发元素图标
}
export interface MDropdownEmits {
    (event: "visible-change", value: boolean): void;
}
export interface MDropdownInstance {
    hide: () => void;
    show: () => void;
    toggle: () => void;
}
export interface MDropdownContext {
    hide: () => void;
}
export const MDropdownContextKey: InjectionKey<MDropdownContext> = Symbol("MDropdownContextKey");
