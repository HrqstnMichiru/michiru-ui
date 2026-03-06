export type SwitchVariant = "primary" | "success" | "warning" | "danger" | "info" | "purple" | "pink" | "gray";

export interface SwitchProps {
    disabled?: boolean; // 是否禁用
    icons?: [string, string]; // [左侧图标, 右侧图标]
    size?: "small" | "medium" | "large";
    variant?: SwitchVariant;
    loading?: boolean; // 是否显示加载状态
}

export interface SwitchEmits {
    (event: "change"): void;
}
