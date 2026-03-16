import type { InjectionKey } from "vue";

export type MCheckBoxVariant = "primary" | "success" | "warning" | "danger" | "info" | "purple" | "pink" | "gray";
type MCheckBoxSize = "small" | "medium" | "large";
export type MCheckBoxState = boolean | "indeterminate";

export interface MCheckBoxProps {
    disabled?: boolean;
    size?: MCheckBoxSize;
    value?: string | number;
    variant?: MCheckBoxVariant;
    label?: string;
    type?: "button" | "box";
    bordered?: boolean;
}
export interface MCheckBoxEmits {
    (event: "change"): void;
}

export interface MCheckBoxGroupProps {
    disabled?: boolean; // 是否禁用所有子选项
    size?: MCheckBoxSize; // 尺寸
    variant?: MCheckBoxVariant; // 风格
    vertical?: boolean; // 是否垂直排列
    type?: "button" | "box"; // 展示类型
    gap?: number;
    bordered?: boolean; // 是否显示边框风格（仅在 box 模式下生效）
}
export interface MCheckBoxGroupEmits {
    (event: "change"): void;
}
export interface MCheckBoxGroupInstance {
    checkAll: () => void;
    uncheckAll: () => void;
}
export interface MCheckBoxGroupContext {
    disabled: boolean;
    size: MCheckBoxSize;
    variant: MCheckBoxVariant;
    type: "button" | "box";
    bordered: boolean;
    toggle: (value: string | number) => void;
    isChecked: (value: string | number) => boolean;
    register: (value: string | number) => void;
}
export const MCheckBoxGroupContextKey: InjectionKey<MCheckBoxGroupContext> = Symbol("MCheckBoxGroupContext");
