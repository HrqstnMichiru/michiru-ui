export type MSwitchVariant = "primary" | "success" | "warning" | "danger" | "info" | "purple" | "pink" | "gray";

export interface MSwitchProps {
    disabled?: boolean; // 是否禁用
    icons?: [string, string]; // [左侧图标, 右侧图标]
    size?: "small" | "medium" | "large";
    variant?: MSwitchVariant;
    loading?: boolean; // 是否显示加载状态
}

export interface MSwitchEmits {
    (event: "change"): void;
}
