import type { InjectionKey } from "vue";

type MRadioBoxVariant = "primary" | "success" | "warning" | "danger" | "info" | "purple" | "pink" | "gray";
type MRadioBoxSize = "small" | "medium" | "large";

export interface MRadioBoxProps {
    disabled?: boolean;
    size?: MRadioBoxSize;
    value?: string | number;
    variant?: MRadioBoxVariant;
    label?: string;
}

export interface MRadioBoxGroupProps {
    disabled?: boolean; // 是否禁用所有子选项
    size?: MRadioBoxSize; // 尺寸
    variant?: MRadioBoxVariant; // 风格
    vertical?: boolean; // 是否垂直排列
    type?: "button" | "box"; // 展示类型
    gap?: number;
}

export interface MRadioBoxGroupEmits {
    (event: "change"): void;
}

export interface MRadioBoxGroupContext {
    disabled: boolean;
    size: MRadioBoxSize;
    variant: MRadioBoxVariant;
    type: "button" | "box";
    isChecked: (value: string | number) => boolean;
    toggleChecked: (value: string | number) => void;
}
export const MRadioBoxGroupContextKey: InjectionKey<MRadioBoxGroupContext> = Symbol("MRadioBoxGroupContext");
