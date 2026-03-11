import type { InjectionKey } from "vue";

type MButtonSize = "small" | "medium" | "large";
type MButtonVariant = "primary" | "success" | "warning" | "danger" | "info" | "purple" | "pink" | "gray";

export interface MButtonProps {
    text?: string; // 按钮文本
    icon?: any; // 图标名称
    size?: MButtonSize; // 按钮大小
    variant?: MButtonVariant; // 按钮类型/颜色
    round?: boolean; // 是否为圆角按钮
    circle?: boolean; // 是否为圆形按钮
    plain?: boolean; // 是否为朴素样式
    outline?: boolean; // 是否为线框样式
    disabled?: boolean; // 是否禁用
    block?: boolean; // 是否为块级按钮
    loading?: boolean; // 加载状态
    ripple?: boolean; // 是否有波纹效果
}
export interface MButtonEmits {
    (e: "click"): void;
}

export interface MButtonGroupProps {
    size?: MButtonSize; // 按钮组内按钮大小
    variant?: MButtonVariant; // 按钮组内按钮类型/颜色
    disabled?: boolean; // 是否禁用按钮组内所有按钮
    vertical?: boolean; // 是否垂直排列按钮组
    plain?: boolean; // 是否为朴素样式
    outline?: boolean; // 是否为线框样式
}
export interface MButtonGroupContext {
    size?: MButtonSize;
    variant?: MButtonVariant;
    disabled?: boolean;
    plain?: boolean;
    vertical?: boolean;
    outline?: boolean;
}
export const MButtonGroupContextKey: InjectionKey<MButtonGroupContext> = Symbol("MButtonGroupContextKey");
