import type { InjectionKey } from "vue";

type MRadioBoxVariant = "primary" | "success" | "warning" | "danger" | "info" | "purple" | "pink" | "gray";
type MRadioBoxSize = "small" | "medium" | "large";

export interface MRadioBoxProps {
    disabled?: boolean; // 是否禁用
    size?: MRadioBoxSize; // 尺寸
    value?: string | number; // 选项的值
    variant?: MRadioBoxVariant; // 风格
    label?: string; // 选项的显示文本
    bordered?: boolean; // 是否有边框
}
export interface MRadioBoxEmits {
    (event: "change"): void;
}

export interface MRadioBoxGroupProps {
    disabled?: boolean; // 是否禁用所有子选项
    size?: MRadioBoxSize; // 尺寸
    variant?: MRadioBoxVariant; // 风格
    vertical?: boolean; // 是否垂直排列
    type?: "button" | "box"; // 展示类型
    gap?: number; // 选项间距，单位为像素，仅在 type="box" 时有效
    bordered?: boolean; // 是否有边框
}

export interface MRadioBoxGroupEmits {
    (event: "change"): void;
}

export interface MRadioBoxGroupContext {
    disabled: boolean;
    size: MRadioBoxSize;
    variant: MRadioBoxVariant;
    type: "button" | "box";
    bordered: boolean;
    isChecked: (value: string | number) => boolean;
    toggleChecked: (value: string | number) => void;
}
export const MRadioBoxGroupContextKey: InjectionKey<MRadioBoxGroupContext> = Symbol("MRadioBoxGroupContext");
