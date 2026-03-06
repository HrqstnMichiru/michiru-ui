import type { InjectionKey } from "vue";

export type CheckBoxVariant = "default" | "primary" | "success" | "warning" | "danger" | "info" | "purple" | "pink" | "gray";
type CheckBoxSize = "small" | "medium" | "large";

export interface CheckBoxProps {
    disabled?: boolean;
    size?: CheckBoxSize;
    value?: string | number;
    variant?: CheckBoxVariant;
    label?: string;
    type?: "button" | "box";
}
export interface CheckBoxEmits {
    (event: "change"): void;
}

export interface CheckBoxGroupProps {
    disabled?: boolean; // 是否禁用所有子选项
    size?: CheckBoxSize; // 尺寸
    variant?: CheckBoxVariant; // 风格
    vertical?: boolean; // 是否垂直排列
    type?: "button" | "box"; // 展示类型
    gap?: number;
}
export interface CheckBoxGroupEmits {
    (event: "change"): void;
}
export interface CheckBoxGroupInstance {
    checkAll: () => void;
    uncheckAll: () => void;
}
export interface CheckBoxGroupContext {
    disabled: boolean;
    size: CheckBoxSize;
    variant: CheckBoxVariant;
    type: "button" | "box";
    toggle: (value: string | number) => void;
    isChecked: (value: string | number) => boolean;
    register: (value: string | number) => void;
}
export const CheckBoxGroupContextKey: InjectionKey<CheckBoxGroupContext> = Symbol("CheckBoxGroupContext");
