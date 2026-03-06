import type { Placement } from "@/components";
import type { InjectionKey } from "vue";

export interface DropdownItemProps {
    label?: string;
    icon?: string;
    disabled?: boolean;
}
export interface DropdownItemEmits {
    (e: "click"): void;
}

export interface DropdownProps {
    hideAfterClick?: boolean; // 点击菜单项后是否隐藏
    trigger?: "hover" | "click" | "manual"; // 触发方式
    placement?: Placement; // 位置
    transition?: "fade" | "unfold" | "none" | "translate";
    block?: boolean; // 是否为块级元素
    disabled?: boolean; // 是否禁用
    width?: number; // 下拉菜单宽度
    showArrow?: boolean; // 是否显示箭头
    offset?: number; // 下拉菜单偏移量，单位px
    timer?: number; // 延时显示时间，单位毫秒
    label?: string; // 触发元素文本
    icon?: string; // 触发元素图标
}
export interface DropdownEmits {
    (event: "visible-change", value: boolean): void;
}
export interface DropdownInstance {
    hide: () => void;
    show: () => void;
    toggle: () => void;
}
export interface DropdownContext {
    hide: () => void;
}
export const DropdownContextKey: InjectionKey<DropdownContext> = Symbol("DropdownContextKey");
