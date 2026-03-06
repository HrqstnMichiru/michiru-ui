import type { InjectionKey } from "vue";

type RadioBoxVariant = "primary" | "success" | "warning" | "danger" | "info" | "purple" | "pink" | "gray" | "default";
type RadioBoxSize = "small" | "medium" | "large";

export interface RadioBoxProps {
    disabled?: boolean;
    size?: RadioBoxSize;
    value?: string | number;
    variant?: RadioBoxVariant;
    label?: string;
}

export interface RadioBoxGroupProps {
    disabled?: boolean; // 是否禁用所有子选项
    size?: RadioBoxSize; // 尺寸
    variant?: RadioBoxVariant; // 风格
    vertical?: boolean; // 是否垂直排列
    type?: "button" | "box"; // 展示类型
    gap?: number;
}

export interface RadioBoxGroupEmits {
    (event: "change"): void;
}

export interface RadioBoxGroupContext {
    disabled: boolean;
    size: RadioBoxSize;
    variant: RadioBoxVariant;
  type: "button" | "box";
    isChecked: (value: string | number) => boolean;
    toggleChecked: (value: string | number) => void;
}
export const RadioBoxGroupContextKey: InjectionKey<RadioBoxGroupContext> = Symbol("RadioBoxGroupContext");
